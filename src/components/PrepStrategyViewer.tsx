import React from "react";
import { Zap, Clock, CheckCircle2, Layers } from "lucide-react";

interface PrepStrategyViewerProps {
  prepItems: string[];
}

export const PrepStrategyViewer: React.FC<PrepStrategyViewerProps> = ({ prepItems }) => {
  if (!prepItems || prepItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs mb-8">
      <div className="p-5 bg-gradient-to-r from-amber-50/70 via-stone-50 to-emerald-50/50 border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-amber-600 text-white rounded-xl shadow-xs">
            <Zap className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Prep Once, Eat Faster
            </h3>
            <p className="text-xs text-stone-500">
              Spend 30–45 minutes upfront to make weekday cooking nearly instantaneous.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full font-medium">
          <Clock className="w-3.5 h-3.5" />
          Save ~2.5 hrs this week
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prepItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200/80 bg-stone-50/60 hover:bg-stone-50 hover:border-amber-200 transition"
            >
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <div className="text-xs text-stone-800 leading-relaxed">
                <span className="font-medium text-stone-900">{item}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3 text-xs text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Pro Coach Tip:</strong> Store pre-cooked grains and roasted potatoes in airtight glass containers. Reheat them with a drop of water or quick skillet sear to restore fresh texture!
          </span>
        </div>
      </div>
    </div>
  );
};
