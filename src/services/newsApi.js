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
    return "";
  }

  // Prepare article summaries for the prompt
  const articleSummaries = articles
    .slice(0, 5) // Only use top 5 articles
    .map((a, i) => `${i + 1}. ${a.headline}: ${a.snippet}`)
    .join("\n");

  const prompt = `You are a sports betting intelligence analyst. Analyze these recent articles from news sites, Reddit, and Twitter about "${teamName}" and provide a brief intelligence summary for a sports bettor.

Sources (News, Reddit, Twitter):
${articleSummaries}

Provide a concise summary (max 3-4 sentences) highlighting:
- Key injury updates or player status changes
- Community sentiment (what Reddit/Twitter is saying)
- Recent performance trends
- Any factors that could impact betting (weather, travel, matchups)

Format with emojis for quick scanning. Be direct and actionable. Note if there's consensus or disagreement between sources.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a sports betting intelligence analyst. Be concise, use emojis, focus on actionable insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI summary");
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

/**
 * Full intelligence search: fetch news + generate AI summary
 * @param {string} query - Search term
 * @returns {Promise<{articles: Array, summary: string}>}
 */
export async function getIntelligence(query) {
  // Fetch news articles
  const articles = await searchNews(query);
  
  // Generate AI summary
  let summary = "";
  try {
    summary = await generateAiSummary(articles, query);
  } catch (err) {
    console.error("AI summary failed:", err);
    summary = `📰 Found ${articles.length} articles about ${query}. AI summary unavailable.`;
  }

  return { articles, summary };
}
