import React, { useState } from "react";
import { ParsedGroceryCategory } from "../utils/planParser";
import { CheckSquare, Square, Copy, Check, ShoppingBag, RotateCcw } from "lucide-react";

interface GroceryListViewerProps {
  categories: ParsedGroceryCategory[];
  rawGroceryMarkdown?: string;
}

export const GroceryListViewer: React.FC<GroceryListViewerProps> = ({
  categories,
  rawGroceryMarkdown,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleItem = (itemKey: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  const handleCopy = () => {
    let text = "🛒 5-Day Consolidated Grocery List\n\n";
    categories.forEach((cat) => {
      text += `## ${cat.categoryName}\n`;
      cat.items.forEach((item) => {
        text += `- ${item}\n`;
      });
      text += "\n";
    });

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const resetAll = () => {
    setCheckedItems({});
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500">
        <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-stone-400" />
        <p>No grocery list parsed yet. Check the full plan tab.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
      {/* Top Banner */}
      <div className="p-5 bg-gradient-to-r from-emerald-50 to-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-700 text-white rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              5-Day Consolidated Grocery List
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Ingredients consolidated across all 15 meals with practical purchase quantities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-600">
            {checkedCount} / {totalItems} packed
          </div>
          {checkedCount > 0 && (
            <button
              onClick={resetAll}
              className="p-1.5 text-stone-500 hover:text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 text-xs flex items-center gap-1"
              title="Reset checkmarks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-medium rounded-lg transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy List"}
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, catIdx) => (
          <div
            key={catIdx}
            className="border border-stone-200 rounded-xl bg-stone-50/50 p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-200">
                <h4 className="font-serif font-semibold text-stone-900 text-sm">
                  {category.categoryName}
                </h4>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  {category.items.length} items
                </span>
              </div>

              <ul className="space-y-2">
                {category.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isChecked = Boolean(checkedItems[key]);
                  return (
                    <li
                      key={itemIdx}
                      onClick={() => toggleItem(key)}
                      className={`flex items-start gap-2.5 p-1.5 rounded-lg cursor-pointer transition select-none text-xs ${
                        isChecked
                          ? "bg-emerald-50/60 text-stone-400 line-through"
                          : "hover:bg-white text-stone-800"
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 shrink-0 text-stone-400 hover:text-emerald-700"
                        aria-label={isChecked ? "Uncheck item" : "Check item"}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-stone-400" />
                        )}
                      </button>
                      <span className="leading-snug">{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
