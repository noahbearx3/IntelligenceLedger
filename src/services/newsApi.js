const SERPER_KEY = import.meta.env.VITE_SERPER_KEY;
const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY;

// Serper works everywhere (no localhost restriction like NewsAPI)
export const canUseRealApi = !!(SERPER_KEY && OPENAI_KEY);

/**
 * Detect source type from URL or title
 */
function detectSourceType(url, title) {
  const urlLower = url?.toLowerCase() || "";
  const titleLower = title?.toLowerCase() || "";
  
  if (urlLower.includes("reddit.com") || urlLower.includes("redd.it")) return "Reddit";
  if (urlLower.includes("twitter.com") || urlLower.includes("x.com")) return "Twitter";
  if (urlLower.includes("espn.com")) return "ESPN";
  if (urlLower.includes("nfl.com")) return "NFL.com";
  if (urlLower.includes("yahoo.com")) return "Yahoo Sports";
  if (urlLower.includes("cbssports.com")) return "CBS Sports";
  if (urlLower.includes("bleacherreport.com")) return "Bleacher Report";
  if (urlLower.includes("theathletic.com")) return "The Athletic";
  if (urlLower.includes("profootballtalk")) return "Pro Football Talk";
  
  return "News";
}

/**
 * Search for news, Reddit, and Twitter using Serper (Google Search API)
 * @param {string} query - Search term (e.g., "Buffalo Bills")
 * @returns {Promise<Array>} Array of articles from various sources
 */
export async function searchNews(query) {
  // Search for news + Reddit + Twitter in one query
  const searchQuery = `${query} (site:reddit.com OR site:twitter.com OR news)`;
  
  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": SERPER_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: searchQuery,
      num: 20,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch search results");
  }

  const data = await response.json();
  
  // Combine organic results and news results
  const allResults = [
    ...(data.organic || []),
    ...(data.news || []),
  ];

  // Transform to our article format
  return allResults.map((result, index) => ({
    id: index + 1,
    headline: result.title || "Untitled",
    snippet: result.snippet || result.description || "",
    source: detectSourceType(result.link, result.title),
    url: result.link,
    timestamp: result.date || new Date().toISOString(),
    imageUrl: result.imageUrl || result.thumbnail,
    relatedTeams: [query],
  }));
}

/**
 * Generate AI summary of news articles using OpenAI
 * @param {Array} articles - Array of news articles
 * @param {string} teamName - Team/player name for context
 * @returns {Promise<string>} AI-generated summary
 */
export async function generateAiSummary(articles, teamName) {
  if (!articles || articles.length === 0) {
    return "📭 No articles found to summarize.";
  }

  // Check if OpenAI key is available
  if (!OPENAI_KEY) {
    console.warn("OpenAI API key not configured");
    return `📰 Found ${articles.length} articles about ${teamName}. Configure OpenAI for AI summaries.`;
  }

  // Prepare article summaries for the prompt
  const articleSummaries = articles
    .slice(0, 5) // Only use top 5 articles
    .map((a, i) => `${i + 1}. ${a.headline}: ${a.snippet}`)
    .join("\n");

  const prompt = `Analyze these sports articles about "${teamName}" for a bettor. Give a 2-3 sentence summary with key insights (injuries, sentiment, trends). Use emojis.

${articleSummaries}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // More reliable than gpt-4o-mini
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", response.status, error);
      
      // Return a helpful fallback based on error type
      if (response.status === 401) {
        return `🔑 API key issue. Found ${articles.length} articles about ${teamName}.`;
      } else if (response.status === 429) {
        return `⏳ Rate limited. Found ${articles.length} articles about ${teamName}.`;
      } else if (response.status === 402 || response.status === 403) {
        return `💳 Quota exceeded. Found ${articles.length} articles about ${teamName}.`;
      }
      return `⚠️ AI unavailable. Found ${articles.length} articles about ${teamName}.`;
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || `📰 Found ${articles.length} articles about ${teamName}.`;
  } catch (err) {
    console.error("OpenAI fetch error:", err);
    return `📡 Connection error. Found ${articles.length} articles about ${teamName}.`;
  }
}

/**
 * Full intelligence search: fetch news + generate AI summary
 * @param {string} query - Search term
 * @returns {Promise<{articles: Array, summary: string}>}
 */
export async function getIntelligence(query) {
  // Fetch news articles
  const articles = await searchNews(query);
  
  // Generate AI summary (function now handles its own errors)
  const summary = await generateAiSummary(articles, query);

  return { articles, summary };
}
