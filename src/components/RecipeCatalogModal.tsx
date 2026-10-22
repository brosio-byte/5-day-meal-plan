import React, { useState } from "react";
import { APPROVED_RECIPES, ApprovedRecipe } from "../data/mealCoachData";
import { X, Search, Clock, Sparkles, ChefHat } from "lucide-react";

interface RecipeCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSwap?: (recipe: ApprovedRecipe) => void;
}

export const RecipeCatalogModal: React.FC<RecipeCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectSwap,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const categories = ["All", "Breakfast", "Lunch", "Dinner"];

  const filteredRecipes = APPROVED_RECIPES.filter((r) => {
    const matchesCategory = selectedCategory === "All" || r.category === selectedCategory;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-stone-50 text-stone-900 rounded-2xl shadow-2xl border border-stone-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <ChefHat className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Approved Recipes Knowledge Base
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              24 official coach recipes designed for taste, high protein, and low prep time.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-3 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === cat
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-white text-stone-600 hover:bg-stone-200/80 border border-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search ingredient or recipe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Recipe Cards List */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs hover:border-emerald-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      recipe.category === "Breakfast"
                        ? "bg-amber-100 text-amber-800"
                        : recipe.category === "Lunch"
                        ? "bg-sky-100 text-sky-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {recipe.category}
                  </span>
                  <div className="flex gap-1">
                    {recipe.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="font-serif font-bold text-stone-900 text-base mb-2">
                  {recipe.name}
                </h3>

                <div className="mb-3">
                  <p className="text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Ingredients:
                  </p>
                  <ul className="text-xs text-stone-700 space-y-0.5 list-disc pl-4">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <p className="text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Instructions:
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                    {recipe.directions}
                  </p>
                </div>

                {recipe.prepNotes && (
                  <div className="flex items-start gap-1.5 text-xs text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-100">
                    <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{recipe.prepNotes}</span>
                  </div>
                )}
              </div>

              {onSelectSwap && (
                <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
                  <button
                    onClick={() => {
                      onSelectSwap(recipe);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition"
                  >
                    <Sparkles className="w-3 h-3" />
                    Swap this into my plan
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredRecipes.length === 0 && (
            <div className="col-span-full py-12 text-center text-stone-400">
              No approved recipes matched your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
