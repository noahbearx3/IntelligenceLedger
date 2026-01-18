const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY;
const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY;

/**
 * Search for news articles using NewsAPI
 * @param {string} query - Search term (e.g., "Buffalo Bills")
 * @returns {Promise<Array>} Array of news articles
 */
export async function searchNews(query) {
  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", query);
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("language", "en");
  url.searchParams.set("pageSize", "15");
  url.searchParams.set("apiKey", NEWSAPI_KEY);

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch news");
  }

  const data = await response.json();
  
  // Transform to our article format
  return data.articles.map((article, index) => ({
    id: index + 1,
    headline: article.title || "Untitled",
    snippet: article.description || article.content?.slice(0, 150) || "",
    source: article.source?.name || "Unknown",
    url: article.url,
    timestamp: article.publishedAt,
    imageUrl: article.urlToImage,
    relatedTeams: [query], // Tag with the search query
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

  const prompt = `You are a sports betting intelligence analyst. Analyze these recent news articles about "${teamName}" and provide a brief intelligence summary for a sports bettor.

Articles:
${articleSummaries}

Provide a concise summary (max 3-4 sentences) highlighting:
- Key injury updates or player status changes
- Recent performance trends
- Any factors that could impact betting (weather, travel, matchups)

Format with emojis for quick scanning. Be direct and actionable.`;

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
