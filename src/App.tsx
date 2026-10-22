import React, { useState, useEffect } from "react";
import { IntakeForm, IntakeFormData, INITIAL_INTAKE_FORM } from "./components/IntakeForm";
import { MealPlanViewer } from "./components/MealPlanViewer";
import { GroceryListViewer } from "./components/GroceryListViewer";
import { PrepStrategyViewer } from "./components/PrepStrategyViewer";
import { RecipeCatalogModal } from "./components/RecipeCatalogModal";
import { ChatTweakDrawer, ChatMessage } from "./components/ChatTweakDrawer";
import { parseMealPlanMarkdown, ParsedPlan } from "./utils/planParser";
import { ApprovedRecipe } from "./data/mealCoachData";
import {
  Utensils,
  BookOpen,
  ShoppingBag,
  Zap,
  Printer,
  Copy,
  Check,
  RotateCcw,
  MessageSquare,
  FileText,
  AlertCircle,
  Activity,
  Calendar,
} from "lucide-react";

const STORAGE_KEY_PLAN = "meal_plan_coach_saved_plan";
const STORAGE_KEY_MSGS = "meal_plan_coach_saved_msgs";

export default function App() {
  const [phase, setPhase] = useState<"intake" | "plan">("intake");
  const [rawPlanMarkdown, setRawPlanMarkdown] = useState<string>("");
  const [parsedPlan, setParsedPlan] = useState<ParsedPlan | null>(null);
  const [activeTab, setActiveTab] = useState<"plan" | "prep" | "grocery" | "markdown">("plan");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugStatus, setDebugStatus] = useState<string | null>(null);
  const [copiedPlan, setCopiedPlan] = useState(false);

  // Modals / Drawers
  const [isRecipeCatalogOpen, setIsRecipeCatalogOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  // Load saved plan from localStorage on mount
  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem(STORAGE_KEY_PLAN);
      const savedMsgs = localStorage.getItem(STORAGE_KEY_MSGS);
      if (savedPlan) {
        setRawPlanMarkdown(savedPlan);
        setParsedPlan(parseMealPlanMarkdown(savedPlan));
        setPhase("plan");
      }
      if (savedMsgs) {
        setChatMessages(JSON.parse(savedMsgs));
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
  }, []);

  const buildSummaryFromForm = (f: IntakeFormData) => {
    const lines: string[] = [];
    if (f.age) lines.push(`Age: ${f.age}`);
    if (f.sex) lines.push(`Sex: ${f.sex}`);
    if (f.units === "imperial") {
      if (f.heightFt || f.heightIn) lines.push(`Height: ${f.heightFt || 0}'${f.heightIn || 0}"`);
      if (f.weight) lines.push(`Weight: ${f.weight} lbs`);
    } else {
      if (f.heightCm) lines.push(`Height: ${f.heightCm} cm`);
      if (f.weight) lines.push(`Weight: ${f.weight} kg`);
    }
    if (f.activity) lines.push(`Activity level: ${f.activity}`);
    if (f.cooking) lines.push(`Cooking preference: ${f.cooking}`);
    if (f.allergies.trim()) lines.push(`Allergies or dietary restrictions: ${f.allergies.trim()}`);
    if (f.dislikes.trim()) lines.push(`Foods I dislike: ${f.dislikes.trim()}`);

    if (lines.length === 0) {
      return "No specific physical constraints provided. Please build a generally balanced, delicious, easy, high-protein 5-day meal plan with overlapping ingredients.";
    }
    return lines.join("\n");
  };

  const handleTestConnection = async () => {
    setDebugStatus("Testing server connection…");
    try {
      const res = await fetch("/api/health");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setDebugStatus(
        `Server connected: Model ${data.model} | API Key present: ${data.hasKey ? "Yes" : "No"}`
      );
      setTimeout(() => setDebugStatus(null), 6000);
    } catch (err: any) {
      setDebugStatus(`Connection error: ${err?.message || "Failed to contact backend"}`);
    }
  };

  const handleGeneratePlan = async (formData: IntakeFormData) => {
    const summary = buildSummaryFromForm(formData);
    const initialUserMsg = `Here are my meal plan preferences and answers:\n\n${summary}\n\nPlease select 5 breakfasts, 5 lunches, and 5 dinners from the approved knowledge database. Include the Personalized Introduction, the 5-Day Plan, the "Prep Once, Eat Faster" section, and the consolidated "5-Day Grocery List".`;

    const newMsgs: ChatMessage[] = [{ role: "user", content: initialUserMsg }];
    setChatMessages(newMsgs);
    setIsLoading(true);
    setError(null);
    setPhase("plan");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const planMarkdown = data.text || "";

      setRawPlanMarkdown(planMarkdown);
      const parsed = parseMealPlanMarkdown(planMarkdown);
      setParsedPlan(parsed);

      const updatedMsgs: ChatMessage[] = [
        ...newMsgs,
        { role: "assistant", content: planMarkdown },
      ];
      setChatMessages(updatedMsgs);

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY_PLAN, planMarkdown);
        localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(updatedMsgs));
      } catch (_) {}
    } catch (err: any) {
      console.error("Failed to generate plan:", err);
      setError(err?.message || "Something went wrong while contacting the coach. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const nextMsgs: ChatMessage[] = [...chatMessages, { role: "user", content: text }];
    setChatMessages(nextMsgs);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMsgs }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const assistantText = data.text || "";

      const updatedMsgs: ChatMessage[] = [
        ...nextMsgs,
        { role: "assistant", content: assistantText },
      ];
      setChatMessages(updatedMsgs);

      // If the reply contains a full plan update, update the parsed plan too
      if (/Day\s*1/i.test(assistantText) && /Breakfast/i.test(assistantText)) {
        setRawPlanMarkdown(assistantText);
        setParsedPlan(parseMealPlanMarkdown(assistantText));
        try {
          localStorage.setItem(STORAGE_KEY_PLAN, assistantText);
        } catch (_) {}
      }

      try {
        localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(updatedMsgs));
      } catch (_) {}
    } catch (err: any) {
      console.error("Chat message error:", err);
      setError(err?.message || "Failed to communicate with the coach.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSwapFromCatalog = (recipe: ApprovedRecipe) => {
    const swapPrompt = `Please swap one of my current ${recipe.category.toLowerCase()}s with the approved recipe "${recipe.name}". Update the affected day, adjust the prep notes if needed, and update the grocery list.`;
    handleSendMessage(swapPrompt);
    setIsChatDrawerOpen(true);
  };

  const handleQuickSwap = (dayNum: number, mealType: "Breakfast" | "Lunch" | "Dinner") => {
    const swapPrompt = `Please suggest an alternative approved ${mealType.toLowerCase()} for Day ${dayNum} and update the grocery list accordingly.`;
    handleSendMessage(swapPrompt);
    setIsChatDrawerOpen(true);
  };

  const handleCopyPlan = () => {
    if (!rawPlanMarkdown) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rawPlanMarkdown).then(() => {
        setCopiedPlan(true);
        setTimeout(() => setCopiedPlan(false), 2000);
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (window.confirm("Start a new meal plan? Your current plan will be cleared.")) {
      setPhase("intake");
      setRawPlanMarkdown("");
      setParsedPlan(null);
      setChatMessages([]);
      setError(null);
      try {
        localStorage.removeItem(STORAGE_KEY_PLAN);
        localStorage.removeItem(STORAGE_KEY_MSGS);
      } catch (_) {}
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans antialiased">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg text-stone-900 tracking-tight leading-none">
                  5-Day Meal Plan Coach
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full">
                  High Protein
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 hidden xs:block">
                Simple, repeatable eating optimized for taste, nutrition & speed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setIsRecipeCatalogOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition"
              title="Browse 24 official approved recipes"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden md:inline">Browse Recipes</span>
              <span className="md:hidden">Recipes</span>
            </button>

            {phase === "plan" && (
              <>
                <button
                  onClick={() => setIsChatDrawerOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 text-xs font-medium flex items-center gap-1.5 transition relative"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Coach Chat</span>
                  {chatMessages.length > 2 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition"
                  title="Print or Save as PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-stone-500" />
                  <span className="hidden sm:inline">Print / PDF</span>
                </button>

                <button
                  onClick={handleReset}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-red-50 hover:text-red-700 text-stone-500 text-xs font-medium flex items-center gap-1 transition"
                  title="New Plan"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Plan</span>
                </button>
              </>
            )}

            <button
              onClick={handleTestConnection}
              className="p-1.5 rounded-lg border border-stone-200 text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              title="Test backend connection"
            >
              <Activity className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Debug notice bar */}
      {debugStatus && (
        <div className="bg-amber-100/90 text-amber-950 border-b border-amber-200 px-4 py-2 text-xs text-center font-mono">
          {debugStatus}
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Plan Generation Error</p>
              <p className="text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {phase === "intake" ? (
          <IntakeForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
        ) : (
          <div>
            {/* Plan View Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-1.5 bg-stone-200/70 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab("plan")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    activeTab === "plan"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  5-Day Meals
                </button>

                <button
                  onClick={() => setActiveTab("prep")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    activeTab === "prep"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  Prep Strategy
                </button>

                <button
                  onClick={() => setActiveTab("grocery")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    activeTab === "grocery"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                  Grocery List
                </button>

                <button
                  onClick={() => setActiveTab("markdown")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    activeTab === "markdown"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-stone-500" />
                  Full Document
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPlan}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  {copiedPlan ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                  )}
                  {copiedPlan ? "Copied" : "Copy Full Plan"}
                </button>
              </div>
            </div>

            {/* Loading state indicator */}
            {isLoading && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
                <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
                <span>Coach is generating your personalized 5-day plan and grocery schedule...</span>
              </div>
            )}

            {/* Tab Views */}
            {activeTab === "plan" && (
              <div className="space-y-6">
                {parsedPlan ? (
                  <MealPlanViewer
                    days={parsedPlan.days}
                    intro={parsedPlan.intro}
                    onQuickSwap={handleQuickSwap}
                  />
                ) : (
                  <div className="p-8 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
                    Generating plan...
                  </div>
                )}
              </div>
            )}

            {activeTab === "prep" && (
              <div>
                {parsedPlan?.prepStrategy && parsedPlan.prepStrategy.length > 0 ? (
                  <PrepStrategyViewer prepItems={parsedPlan.prepStrategy} />
                ) : (
                  <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
                    No specific prep strategy extracted. Check the Full Document tab.
                  </div>
                )}
              </div>
            )}

            {activeTab === "grocery" && (
              <div>
                {parsedPlan?.groceryList ? (
                  <GroceryListViewer categories={parsedPlan.groceryList} />
                ) : (
                  <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
                    No grocery list extracted. Check the Full Document tab.
                  </div>
                )}
              </div>
            )}

            {activeTab === "markdown" && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
                <div className="prose prose-stone max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-mono bg-stone-50 p-4 rounded-xl border border-stone-200">
                  {rawPlanMarkdown || "No plan generated yet."}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-400">
        5-Day Meal Plan Coach • Powered by Gemini 3.8 Flash • Designed for simplicity, speed, and real-life adherence
      </footer>

      {/* Modals & Drawers */}
      <RecipeCatalogModal
        isOpen={isRecipeCatalogOpen}
        onClose={() => setIsRecipeCatalogOpen(false)}
        onSelectSwap={handleSelectSwapFromCatalog}
      />

      <ChatTweakDrawer
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
