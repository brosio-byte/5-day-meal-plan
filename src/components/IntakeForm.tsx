import React, { useState } from "react";
import { Sparkles, Utensils, Zap, ShieldAlert, ArrowRight, User } from "lucide-react";

export interface IntakeFormData {
  units: "imperial" | "metric";
  sex: string;
  age: string;
  heightFt: string;
  heightIn: string;
  heightCm: string;
  weight: string;
  activity: string;
  cooking: string;
  allergies: string;
  dislikes: string;
}

export const INITIAL_INTAKE_FORM: IntakeFormData = {
  units: "imperial",
  sex: "",
  age: "",
  heightFt: "",
  heightIn: "",
  heightCm: "",
  weight: "",
  activity: "",
  cooking: "",
  allergies: "",
  dislikes: "",
};

const PRESETS: { label: string; desc: string; form: Partial<IntakeFormData> }[] = [
  {
    label: "Fast & High Protein",
    desc: "Speed-focused, minimal cleanup, high satiety",
    form: {
      units: "imperial",
      age: "32",
      activity: "Moderately active",
      cooking: "Keep it ridiculously easy",
      allergies: "",
      dislikes: "Mushrooms",
    },
  },
  {
    label: "Batch Prepper",
    desc: "Sunday prep, repeated ingredients, bulk grains",
    form: {
      units: "imperial",
      age: "38",
      activity: "Very active",
      cooking: "I'm fine cooking a little",
      allergies: "",
      dislikes: "",
    },
  },
  {
    label: "Seafood Free & Quick",
    desc: "Poultry, beef, bison, no fish or shellfish",
    form: {
      units: "imperial",
      age: "29",
      activity: "Lightly active",
      cooking: "Keep it ridiculously easy",
      allergies: "Shellfish",
      dislikes: "Salmon, seafood",
    },
  },
];

interface IntakeFormProps {
  onSubmit: (form: IntakeFormData) => void;
  isLoading: boolean;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({ onSubmit, isLoading }) => {
  const [form, setForm] = useState<IntakeFormData>(INITIAL_INTAKE_FORM);

  const updateField = (field: keyof IntakeFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const applyPreset = (preset: Partial<IntakeFormData>) => {
    setForm((prev) => ({ ...prev, ...preset }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="max-w-3xl mx-auto py-4">
      {/* Header Info */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-3">
          <Utensils className="w-3.5 h-3.5" />
          Personalized 5-Day Meal Plan Coach
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
          Eat Healthy Without the Hassle
        </h2>
        <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
          Share your preferences to get a 5-day plan built from 24 approved high-protein meals.
          Everything is optional—skip anything you'd rather not share.
        </p>
      </div>

      {/* Preset Quick Start */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Or pick a quick scenario:
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p.form)}
              className="p-3 text-left rounded-xl border border-stone-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/30 transition shadow-2xs group"
            >
              <div className="font-semibold text-xs text-stone-900 group-hover:text-emerald-800">
                {p.label}
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Intake Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Column 1: Physical Details */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-stone-900 text-base pb-2 border-b border-stone-100 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-700" />
              Body & Details (Optional)
            </h3>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Units of Measurement
              </label>
              <select
                value={form.units}
                onChange={(e) => updateField("units", e.target.value as "imperial" | "metric")}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="imperial">Imperial (lbs, ft & in)</option>
                <option value="metric">Metric (kg, cm)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Sex
                </label>
                <select
                  value={form.sex}
                  onChange={(e) => updateField("sex", e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="">Prefer not to say</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="e.g. 34"
                  value={form.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            {form.units === "imperial" ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Height (ft)
                  </label>
                  <input
                    type="number"
                    placeholder="5"
                    value={form.heightFt}
                    onChange={(e) => updateField("heightFt", e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Height (in)
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    value={form.heightIn}
                    onChange={(e) => updateField("heightIn", e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  placeholder="175"
                  value={form.heightCm}
                  onChange={(e) => updateField("heightCm", e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Weight ({form.units === "imperial" ? "lbs" : "kg"})
              </label>
              <input
                type="number"
                placeholder={form.units === "imperial" ? "e.g. 175" : "e.g. 79"}
                value={form.weight}
                onChange={(e) => updateField("weight", e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Column 2: Lifestyle & Diet */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-stone-900 text-base pb-2 border-b border-stone-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Lifestyle & Preferences
            </h3>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Activity Level
              </label>
              <select
                value={form.activity}
                onChange={(e) => updateField("activity", e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="">Select activity level</option>
                <option value="Mostly sedentary">Mostly sedentary (desk job, low exercise)</option>
                <option value="Lightly active">Lightly active (1-3 light sessions/wk)</option>
                <option value="Moderately active">Moderately active (3-5 workouts/wk)</option>
                <option value="Very active">Very active (daily hard training)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Cooking Preference
              </label>
              <select
                value={form.cooking}
                onChange={(e) => updateField("cooking", e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="">Select preference</option>
                <option value="Keep it ridiculously easy">Keep it ridiculously easy (&lt;15 min / assembly)</option>
                <option value="I'm fine cooking a little">I'm fine cooking a little (simple sheet pan / skillet)</option>
                <option value="I enjoy cooking">I enjoy cooking (happy with all recipes)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Allergies or Dietary Restrictions
              </label>
              <input
                type="text"
                placeholder="e.g. Dairy-free, Gluten-free, Shellfish allergy"
                value={form.allergies}
                onChange={(e) => updateField("allergies", e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Foods You Strongly Dislike
              </label>
              <input
                type="text"
                placeholder="e.g. Mushrooms, Brussels sprouts, Tuna"
                value={form.dislikes}
                onChange={(e) => updateField("dislikes", e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-stone-100 flex flex-col items-center">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Building your 5-day plan with Coach...
              </>
            ) : (
              <>
                Generate My 5-Day Meal Plan
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-[11px] text-stone-400 mt-2 text-center">
            General nutrition guidance only. Not a substitute for medical or individualized clinical advice.
          </p>
        </div>
      </form>
    </div>
  );
};
