import { AIAnalysis } from "../types";

// Simple client-side categorization based on filename patterns
const categorizeByFilename = (filename: string): string => {
  const lower = filename.toLowerCase();

  if (/(screenshot|screen|capture)/i.test(lower)) return "Screenshots";
  if (/(photo|img|pic|image)/i.test(lower)) return "Photos";
  if (/(document|doc|scan|pdf)/i.test(lower)) return "Documents";
  if (/(download|dwnld)/i.test(lower)) return "Downloads";
  if (/(selfie|portrait)/i.test(lower)) return "Selfies";
  if (/(vacation|travel|trip)/i.test(lower)) return "Travel";
  if (/(food|meal|recipe)/i.test(lower)) return "Food";
  if (/(pet|dog|cat)/i.test(lower)) return "Pets";

  return "Photos";
};

// Extract basic tags from filename
const extractTags = (filename: string): string[] => {
  const tags: string[] = [];
  const lower = filename.toLowerCase();

  if (/screenshot/i.test(lower)) tags.push("screenshot");
  if (/\d{8}/.test(filename)) tags.push("dated");
  if (/(vacation|travel)/i.test(lower)) tags.push("travel");
  if (/(selfie|portrait)/i.test(lower)) tags.push("portrait");

  return tags.length > 0 ? tags : ["photo"];
};

export const analyzeImageContent = async (base64Data: string, mimeType: string): Promise<AIAnalysis> => {
  // Simulate async processing
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    category: "Photos",
    tags: ["photo"],
    summary: "Photo uploaded",
    season: "Unknown",
  };
};

// New function that uses filename for categorization
export const analyzeImageFromFile = async (file: File): Promise<AIAnalysis> => {
  // Simulate async processing
  await new Promise(resolve => setTimeout(resolve, 50));

  const category = categorizeByFilename(file.name);
  const tags = extractTags(file.name);

  return {
    category,
    tags,
    summary: `${category} - ${file.name}`,
    season: "Unknown",
  };
};
