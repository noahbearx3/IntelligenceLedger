// Vercel Serverless Function to proxy OpenAI requests (avoids CORS)
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { articles, teamName } = req.body;

  if (!articles || !teamName) {
    return res.status(400).json({ error: 'Missing articles or teamName' });
  }

  const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_KEY;

  if (!OPENAI_KEY) {
    return res.status(500).json({ error: 'OpenAI key not configured' });
  }

  // Prepare article summaries
  const articleSummaries = articles
    .slice(0, 5)
    .map((a, i) => `${i + 1}. ${a.headline}: ${a.snippet}`)
    .join('\n');

  const prompt = `You are a sports betting intelligence analyst. Analyze these recent articles about "${teamName}" and provide a brief intelligence summary for a sports bettor.

Sources:
${articleSummaries}

Provide a concise summary (2-3 sentences) highlighting:
- Key injury updates or player status
- Community sentiment and trends  
- Factors that could impact betting

Use emojis for quick scanning. Be direct and actionable.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a sports betting intelligence analyst. Be concise, use emojis, focus on actionable insights for bettors.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('OpenAI error:', response.status, error);
      return res.status(response.status).json({ 
        error: error.error?.message || 'OpenAI API error',
        status: response.status 
      });
    }

    const data = await response.json();
    const summary = data.choices[0]?.message?.content || '';

    return res.status(200).json({ summary });
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(500).json({ error: 'Failed to connect to OpenAI' });
  }
}
