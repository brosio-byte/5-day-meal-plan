import React, { useState } from "react";
import { ParsedDay, ParsedMeal } from "../utils/planParser";
import { Coffee, Sun, Moon, Sparkles, ChefHat, Check, ArrowRight, Lightbulb, Clock } from "lucide-react";

interface MealPlanViewerProps {
  days: ParsedDay[];
  intro?: string;
  onQuickSwap?: (dayNum: number, mealType: "Breakfast" | "Lunch" | "Dinner") => void;
}

export const MealPlanViewer: React.FC<MealPlanViewerProps> = ({
  days,
  intro,
  onQuickSwap,
}) => {
  const [activeDay, setActiveDay] = useState<number | "all">(1);

  if (!days || days.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
        No meals parsed yet. Check the document view.
      </div>
    );
  }

  const displayedDays = activeDay === "all" ? days : days.filter((d) => d.dayNumber === activeDay);

  return (
    <div className="space-y-6">
      {/* Personalized Intro Banner */}
      {intro && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100/90 text-stone-800 text-xs md:text-sm leading-relaxed flex items-start gap-3">
          <span className="p-1.5 bg-emerald-700 text-white rounded-lg shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <span className="font-semibold text-emerald-950 block mb-0.5">
              Coach's Rationale:
            </span>
            <p className="text-stone-700">{intro}</p>
          </div>
        </div>
      )}

      {/* Day Selector Navigation */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3 gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {days.map((d) => (
            <button
              key={d.dayNumber}
              onClick={() => setActiveDay(d.dayNumber)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeDay === d.dayNumber
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              Day {d.dayNumber}
            </button>
          ))}
          <button
            onClick={() => setActiveDay("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeDay === "all"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            All 5 Days
          </button>
        </div>
      </div>

      {/* Days Cards Container */}
      <div className="space-y-8">
        {displayedDays.map((day) => (
          <div key={day.dayNumber} className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-xl text-stone-900">
                Day {day.dayNumber}
              </h3>
              <div className="h-px bg-stone-200 flex-1 ml-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Breakfast */}
              {day.breakfast && (
                <MealCard
                  meal={day.breakfast}
                  icon={<Coffee className="w-4 h-4 text-amber-600" />}
                  colorClass="border-amber-200/80 bg-gradient-to-b from-amber-50/30 to-white"
                  badgeClass="bg-amber-100 text-amber-900"
                  onSwap={
                    onQuickSwap
                      ? () => onQuickSwap(day.dayNumber, "Breakfast")
                      : undefined
                  }
                />
              )}

              {/* Lunch */}
              {day.lunch && (
                <MealCard
                  meal={day.lunch}
                  icon={<Sun className="w-4 h-4 text-sky-600" />}
                  colorClass="border-sky-200/80 bg-gradient-to-b from-sky-50/30 to-white"
                  badgeClass="bg-sky-100 text-sky-900"
                  onSwap={
                    onQuickSwap
                      ? () => onQuickSwap(day.dayNumber, "Lunch")
                      : undefined
                  }
                />
              )}

              {/* Dinner */}
              {day.dinner && (
                <MealCard
                  meal={day.dinner}
                  icon={<Moon className="w-4 h-4 text-emerald-600" />}
                  colorClass="border-emerald-200/80 bg-gradient-to-b from-emerald-50/30 to-white"
                  badgeClass="bg-emerald-100 text-emerald-900"
                  onSwap={
                    onQuickSwap
                      ? () => onQuickSwap(day.dayNumber, "Dinner")
                      : undefined
                  }
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface MealCardProps {
  meal: ParsedMeal;
  icon: React.ReactNode;
  colorClass: string;
  badgeClass: string;
  onSwap?: () => void;
}

const MealCard: React.FC<MealCardProps> = ({
  meal,
  icon,
  colorClass,
  badgeClass,
  onSwap,
}) => {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition hover:shadow-md ${colorClass}`}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {icon}
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeClass}`}>
              {meal.type}
            </span>
          </div>

          {onSwap && (
            <button
              onClick={onSwap}
              className="text-[11px] text-stone-500 hover:text-emerald-700 font-medium flex items-center gap-1 hover:underline"
            >
              <Sparkles className="w-3 h-3" />
              Swap
            </button>
          )}
        </div>

        <h4 className="font-serif font-bold text-base text-stone-900 mb-2 leading-snug">
          {meal.name}
        </h4>

        {/* Why you'll like it */}
        {meal.whyLike && (
          <p className="text-xs text-stone-600 italic mb-3 bg-stone-50/80 p-2 rounded-lg border border-stone-100">
            "{meal.whyLike}"
          </p>
        )}

        {/* Nutritional benefit */}
        {meal.whyWorks && (
          <div className="mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 block mb-0.5">
              Why it works:
            </span>
            <p className="text-xs text-stone-700">{meal.whyWorks}</p>
          </div>
        )}

        {/* What you need */}
        {meal.whatYouNeed && meal.whatYouNeed.length > 0 && (
          <div className="mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 block mb-1">
              What you need:
            </span>
            <ul className="text-xs text-stone-700 space-y-0.5 list-disc pl-4">
              {meal.whatYouNeed.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Make it */}
        {meal.makeIt && (
          <div className="mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 block mb-1">
              Make it:
            </span>
            <p className="text-xs text-stone-700 bg-white/90 p-2.5 rounded-lg border border-stone-200/70 leading-relaxed">
              {meal.makeIt}
            </p>
          </div>
        )}

        {/* Make it easier */}
        {meal.makeItEasier && (
          <div className="mt-2 text-xs text-emerald-900 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100/90 flex items-start gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Shortcut: </strong>
              <span>{meal.makeItEasier}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
