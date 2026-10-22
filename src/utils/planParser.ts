export interface ParsedMeal {
  type: "Breakfast" | "Lunch" | "Dinner";
  name: string;
  whyLike?: string;
  whyWorks?: string;
  whatYouNeed?: string[];
  makeIt?: string;
  makeItEasier?: string;
  rawText: string;
}

export interface ParsedDay {
  dayNumber: number;
  dayTitle: string;
  breakfast?: ParsedMeal;
  lunch?: ParsedMeal;
  dinner?: ParsedMeal;
}

export interface ParsedGroceryCategory {
  categoryName: string;
  items: string[];
}

export interface ParsedPlan {
  intro: string;
  days: ParsedDay[];
  prepStrategy: string[];
  groceryList: ParsedGroceryCategory[];
  rawMarkdown: string;
}

export function parseMealsSection(markdown: string): { intro: string; days: ParsedDay[] } {
  if (!markdown) return { intro: "", days: [] };

  const lines = markdown.split("\n");
  const introLines: string[] = [];
  let foundFirstDay = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^##\s*Day\s*1/i.test(trimmed)) {
      foundFirstDay = true;
      break;
    }
    if (trimmed && !trimmed.startsWith("#") && !foundFirstDay) {
      introLines.push(trimmed);
    }
  }

  const intro = introLines.join(" ");
  const days: ParsedDay[] = [];

  const dayRegex = /(?:^|\n)##\s*Day\s*(\d+)/gi;
  const dayMatches = Array.from(markdown.matchAll(dayRegex));

  for (let d = 0; d < dayMatches.length; d++) {
    const match = dayMatches[d];
    const dayNum = parseInt(match[1], 10);
    const startIndex = match.index! + match[0].length;
    let endIndex = markdown.length;

    if (d + 1 < dayMatches.length) {
      endIndex = dayMatches[d + 1].index!;
    } else {
      const nextHeader = markdown.slice(startIndex).search(/\n#\s+/);
      if (nextHeader !== -1) {
        endIndex = startIndex + nextHeader;
      }
    }

    const dayChunk = markdown.slice(startIndex, endIndex);
    const parsedDay: ParsedDay = {
      dayNumber: dayNum,
      dayTitle: `Day ${dayNum}`,
      breakfast: parseMealFromChunk(dayChunk, "Breakfast"),
      lunch: parseMealFromChunk(dayChunk, "Lunch"),
      dinner: parseMealFromChunk(dayChunk, "Dinner"),
    };

    days.push(parsedDay);
  }

  return { intro, days };
}

export function parsePrepSection(markdown: string): string[] {
  if (!markdown) return [];

  const lines = markdown.split("\n");
  const prepStrategy: string[] = [];
  let currentPrepItem = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#")) continue;

    if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || /^\d+[\.\)]\s/.test(trimmed)) {
      if (currentPrepItem) prepStrategy.push(currentPrepItem);
      currentPrepItem = trimmed.replace(/^[-*]\s+|\d+[\.\)]\s+/, "").trim();
    } else if (currentPrepItem) {
      currentPrepItem += " " + trimmed;
    } else if (trimmed.length > 5 && !trimmed.startsWith("---")) {
      currentPrepItem = trimmed;
    }
  }

  if (currentPrepItem) prepStrategy.push(currentPrepItem);
  return prepStrategy;
}

export function parseGrocerySection(markdown: string): ParsedGroceryCategory[] {
  if (!markdown) return [];

  const lines = markdown.split("\n");
  const groceryList: ParsedGroceryCategory[] = [];
  let currentCat: ParsedGroceryCategory | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "---") continue;

    // Check for category header
    if (
      trimmed.startsWith("### ") ||
      trimmed.startsWith("## ") ||
      /^\*\*[^*]+:\*\*/.test(trimmed) ||
      /^(?:Protein|Produce|Dairy|Carbs|Grains|Pantry|Sauces|Flavor|Seasonings)/i.test(trimmed) && trimmed.endsWith(":")
    ) {
      const catName = trimmed.replace(/^#+\s*|\*\*|:/g, "").trim();
      if (catName && !/Grocery List/i.test(catName)) {
        currentCat = { categoryName: catName, items: [] };
        groceryList.push(currentCat);
      }
    } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || /^\d+[\.\)]\s/.test(trimmed)) {
      const item = trimmed.replace(/^[-*]\s+|\d+[\.\)]\s+/, "").trim();
      if (item) {
        if (!currentCat) {
          currentCat = { categoryName: "General", items: [] };
          groceryList.push(currentCat);
        }
        currentCat.items.push(item);
      }
    }
  }

  return groceryList;
}

export function parseMealPlanMarkdown(markdown: string): ParsedPlan {
  const result: ParsedPlan = {
    intro: "",
    days: [],
    prepStrategy: [],
    groceryList: [],
    rawMarkdown: markdown,
  };

  if (!markdown) return result;

  const { intro, days } = parseMealsSection(markdown);
  result.intro = intro;
  result.days = days;

  // Locate Prep section
  const prepIndex = markdown.search(/#+\s*(?:Prep\s+Once|Prep\s+Strategy)/i);
  const groceryIndex = markdown.search(/#+\s*(?:Your\s+)?(?:5-Day\s+)?Grocery\s+List/i);

  if (prepIndex !== -1) {
    const prepEnd = groceryIndex !== -1 && groceryIndex > prepIndex ? groceryIndex : markdown.length;
    const prepChunk = markdown.slice(prepIndex, prepEnd);
    result.prepStrategy = parsePrepSection(prepChunk);
  }

  if (groceryIndex !== -1) {
    const groceryChunk = markdown.slice(groceryIndex);
    result.groceryList = parseGrocerySection(groceryChunk);
  }

  return result;
}

function parseMealFromChunk(chunk: string, type: "Breakfast" | "Lunch" | "Dinner"): ParsedMeal | undefined {
  const mealRegex = new RegExp(`###\\s*${type}\\s*[—–-]\\s*([^\n]+)`, "i");
  const match = chunk.match(mealRegex);
  if (!match) return undefined;

  const mealName = match[1].trim();
  const mealStartIndex = match.index! + match[0].length;

  const nextMeal = chunk.slice(mealStartIndex).search(/###\s*(?:Breakfast|Lunch|Dinner)/i);
  const mealText = nextMeal !== -1 ? chunk.slice(mealStartIndex, mealStartIndex + nextMeal) : chunk.slice(mealStartIndex);

  const getSubSection = (label: string) => {
    const rx = new RegExp(`\\*\\*${label}:?\\*\\*([^*#]+)`, "i");
    const m = mealText.match(rx);
    return m ? m[1].trim() : undefined;
  };

  const whyLike = getSubSection("Why you'll like it");
  const whyWorks = getSubSection("Why it works");
  const whatYouNeedRaw = getSubSection("What you need");
  const makeIt = getSubSection("Make it");
  const makeItEasier = getSubSection("Make it easier");

  let whatYouNeed: string[] | undefined;
  if (whatYouNeedRaw) {
    whatYouNeed = whatYouNeedRaw
      .split("\n")
      .map((l) => l.replace(/^[-*]\s+/, "").trim())
      .filter((l) => l.length > 0);
  }

  return {
    type,
    name: mealName,
    whyLike,
    whyWorks,
    whatYouNeed,
    makeIt,
    makeItEasier,
    rawText: mealText.trim(),
  };
}
