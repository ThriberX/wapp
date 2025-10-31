export async function callAI(modelName, prompt) {
  const models = {
    claude: {
      url: 'https://api.anthropic.com/v1/messages',
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: {
        model: 'claude-3-haiku-20240307',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
      },
      parseResponse: (data) => data.content?.[0]?.text
    },
    
    gemini: {
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      headers: { 'Content-Type': 'application/json' },
      body: {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      },
      parseResponse: (data) => data.candidates?.[0]?.content?.parts?.[0]?.text
    },
    
    openai: {
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
      },
      parseResponse: (data) => data.choices?.[0]?.message?.content
    }
  };

  const config = models[modelName.toLowerCase()];
  
  if (!config) {
    throw new Error(`Invalid model: ${modelName}. Valid models: ${Object.keys(models).join(', ')}`);
  }

  const response = await fetch(config.url, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify(config.body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || `${modelName} API failed`);
  }

  const result = config.parseResponse(data);
  
  if (!result) {
    throw new Error(`No content received from ${modelName}`);
  }

  return { result };
}