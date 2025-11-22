// Netlify Function: proxies prompts to the Generative Language API
// Expects POST JSON body: { prompt: '...' }
// Requires `API_KEY` set in Netlify environment variables.

exports.handler = async function (event, context) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const prompt = body.prompt;
    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing prompt" }),
      };
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server not configured with API_KEY" }),
      };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Upstream API error", details: text }),
      };
    }

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return { statusCode: 200, body: JSON.stringify({ text }) };
  } catch (err) {
    console.error("Netlify function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
