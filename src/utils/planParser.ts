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

export function parseMealPlanMarkdown(markdown: string): ParsedPlan {
  const result: ParsedPlan = {
    intro: "",
    days: [],
    prepStrategy: [],
    groceryList: [],
    rawMarkdown: markdown,
  };

  if (!markdown) return result;

  // Split into major sections
  const lines = markdown.split("\n");
  let currentSection: "intro" | "plan" | "prep" | "grocery" = "intro";
  let introLines: string[] = [];
  let prepLines: string[] = [];
  let groceryLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (/^#+\s*(?:Your\s+)?5-Day\s+Meal\s+Plan/i.test(trimmed)) {
      currentSection = "plan";
      continue;
    } else if (/^#+\s*Prep\s+Once/i.test(trimmed) || /^#+\s*Prep\s+Strategy/i.test(trimmed)) {
      currentSection = "prep";
      continue;
    } else if (/^#+\s*(?:Your\s+)?(?:5-Day\s+)?Grocery\s+List/i.test(trimmed)) {
      currentSection = "grocery";
      continue;
    }

    if (currentSection === "intro") {
      if (trimmed && !trimmed.startsWith("#")) {
        introLines.push(trimmed);
      }
    } else if (currentSection === "prep") {
      if (trimmed) prepLines.push(trimmed);
    } else if (currentSection === "grocery") {
      if (trimmed) groceryLines.push(trimmed);
    }
  }

  result.intro = introLines.join(" ");

  // Parse Days 1-5
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
      // Look for next top header
      const nextHeader = markdown.slice(startIndex).search(/\n#\s+/);
      if (nextHeader !== -1) {
        endIndex = startIndex + nextHeader;
      }
    }

    const dayChunk = markdown.slice(startIndex, endIndex);
    const parsedDay: ParsedDay = {
      dayNumber: dayNum,
      dayTitle: `Day ${dayNum}`,
    };

    // Extract Breakfast, Lunch, Dinner
    parsedDay.breakfast = parseMealFromChunk(dayChunk, "Breakfast");
    parsedDay.lunch = parseMealFromChunk(dayChunk, "Lunch");
    parsedDay.dinner = parseMealFromChunk(dayChunk, "Dinner");

    result.days.push(parsedDay);
  }

  // Parse Prep Strategy items
  let currentPrepItem = "";
  for (const pl of prepLines) {
    if (pl.startsWith("* ") || pl.startsWith("- ") || /^\d+\.\s/.test(pl)) {
      if (currentPrepItem) result.prepStrategy.push(currentPrepItem);
      currentPrepItem = pl.replace(/^[-*]\s+|\d+\.\s+/, "").trim();
    } else if (currentPrepItem) {
      currentPrepItem += " " + pl;
    } else if (pl && !pl.startsWith("#")) {
      currentPrepItem = pl;
    }
  }
  if (currentPrepItem) result.prepStrategy.push(currentPrepItem);

  // Parse Grocery list categories
  let currentCat: ParsedGroceryCategory | null = null;
  for (const gl of groceryLines) {
    if (gl.startsWith("### ") || gl.startsWith("## ") || /^\*\*[^*]+:\*\*/.test(gl)) {
      const catName = gl.replace(/^#+\s*|\*\*|:/g, "").trim();
      if (catName) {
        currentCat = { categoryName: catName, items: [] };
        result.groceryList.push(currentCat);
      }
    } else if (gl.startsWith("* ") || gl.startsWith("- ") || /^\d+\.\s/.test(gl)) {
      const item = gl.replace(/^[-*]\s+|\d+\.\s+/, "").trim();
      if (item) {
        if (!currentCat) {
          currentCat = { categoryName: "General", items: [] };
          result.groceryList.push(currentCat);
        }
        currentCat.items.push(item);
      }
    }
  }

  return result;
}

function parseMealFromChunk(chunk: string, type: "Breakfast" | "Lunch" | "Dinner"): ParsedMeal | undefined {
  const mealRegex = new RegExp(`###\\s*${type}\\s*[—–-]\\s*([^\n]+)`, "i");
  const match = chunk.match(mealRegex);
  if (!match) return undefined;

  const mealName = match[1].trim();
  const mealStartIndex = match.index! + match[0].length;

  // Meal ends at the next meal header or end of chunk
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
