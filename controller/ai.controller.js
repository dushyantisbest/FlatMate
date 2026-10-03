import "dotenv/config";
import Listing from "../models/listing.model.js";
import asyncWrapper from "../utils/asyncWraper.js";
import ErrorHandlingExpress from "../utils/ErrorHandling.js";
import OpenAI from "openai";

const getOpenAIClient = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

export const renderChatbot = (req, res) => {
  res.render("ai/chatbot.ejs");
};

// Fallback rule-based filter extractor in case OpenAI API has quota limit (429) or is unreachable
const fallbackExtractFilters = (text) => {
  const filters = {};
  const lower = text.toLowerCase();

  // Price matching (e.g. "under 2000", "below 15000", "less than 500")
  const maxPriceMatch = lower.match(/(?:under|below|less than|max|up to)\s*(?:₹|rs\.?|\$)?\s*(\d+)/i);
  if (maxPriceMatch) {
    filters.maxPrice = parseInt(maxPriceMatch[1], 10);
  }

  const minPriceMatch = lower.match(/(?:above|more than|min|at least)\s*(?:₹|rs\.?|\$)?\s*(\d+)/i);
  if (minPriceMatch) {
    filters.minPrice = parseInt(minPriceMatch[1], 10);
  }

  // Common category keywords
  const categories = ["1bhk", "2bhk", "3bhk", "4bhk", "studio", "villa", "penthouse", "farmhouse"];
  for (const cat of categories) {
    if (lower.includes(cat)) {
      filters.category = cat;
      break;
    }
  }

  // Location heuristic: words following "in", "near", "at"
  const locationMatch = lower.match(/(?:in|near|at|around)\s+([a-zA-Z\s]+?)(?:\s+(?:under|below|for|with|less)|$)/i);
  if (locationMatch) {
    filters.location = locationMatch[1].trim();
  } else {
    // If no preposition, check if words match known cities or locations
    const knownWords = ["new york", "mumbai", "delhi", "malibu", "tuscany", "london", "bangalore", "pune", "goa", "tokyo"];
    for (const place of knownWords) {
      if (lower.includes(place)) {
        filters.location = place;
        break;
      }
    }
  }

  return filters;
};

export const queryListings = asyncWrapper(async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Message is required" });
  }

  let args = {};
  let summary = "";

  try {
    const openai = getOpenAIClient();
    const systemPrompt = `You are a helpful assistant for a flatmate and apartment finder app named FlatMate.
Your goal is to extract search filters for listings based on the user's natural language query.
Call the function 'extractFilters' with the extracted filters.
If the query is vague, extract whatever you can or return empty values to match everything.`;

    const tools = [
      {
        type: "function",
        function: {
          name: "extractFilters",
          description: "Extract listing search filters from the user query",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city, area, or locality (e.g., 'New York', 'Mumbai', 'Malibu').",
              },
              country: {
                type: "string",
                description: "The country.",
              },
              category: {
                type: "string",
                description: "Category like '1BHK', '2BHK', '3BHK', 'studio', 'villa'.",
              },
              minPrice: {
                type: "number",
                description: "Minimum price.",
              },
              maxPrice: {
                type: "number",
                description: "Maximum price (e.g. 'under 2000' -> 2000).",
              },
            },
          },
        },
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      tools: tools,
      tool_choice: { type: "function", function: { name: "extractFilters" } },
    });

    const toolCall = completion.choices[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      args = JSON.parse(toolCall.function.arguments || "{}");
    }
  } catch (apiError) {
    console.warn("OpenAI API call failed or quota exceeded. Falling back to local NLP extraction:", apiError.message);
    args = fallbackExtractFilters(message);
  }

  // Construct MongoDB Query based on extracted filters
  const query = {};
  if (args.location) {
    query.$or = [
      { location: { $regex: args.location, $options: "i" } },
      { title: { $regex: args.location, $options: "i" } },
      { country: { $regex: args.location, $options: "i" } }
    ];
  }
  if (args.country) {
    query.country = { $regex: args.country, $options: "i" };
  }
  if (args.category) {
    query.category = { $regex: args.category, $options: "i" };
  }
  if (args.minPrice || args.maxPrice) {
    query.price = {};
    if (args.minPrice) query.price.$gte = args.minPrice;
    if (args.maxPrice) query.price.$lte = args.maxPrice;
  }

  const listings = await Listing.find(query).limit(10).sort({ price: 1 });

  // Generate summary
  if (listings.length > 0) {
    summary = `I found ${listings.length} property match${listings.length === 1 ? '' : 'es'} matching your search criteria${args.location ? ' in ' + args.location : ''}${args.maxPrice ? ' under ₹' + args.maxPrice.toLocaleString('en-IN') : ''}.`;
  } else {
    summary = `I couldn't find any exact listings matching "${message}". Try broadening your price range or search terms!`;
  }

  return res.status(200).json({
    summary,
    listings,
    filters: args
  });
});
