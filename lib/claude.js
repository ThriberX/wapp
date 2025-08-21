import { NextResponse } from 'next/server';

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

export async function callClaudeAPI(prompt) {
  if (!CLAUDE_API_KEY) {
    throw new Error('Claude API key is not configured.');
  }

  const apiUrl = 'https://api.anthropic.com/v1/messages';
  const headers = {
    'x-api-key': CLAUDE_API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
  };
  const requestBody = {
    model: 'claude-3-haiku-20240307',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1024,
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();

  if (response.ok) {
    const result = data.content?.[0]?.text;
    if (!result) throw new Error('No content received from Claude.');
    return { result };
  } else {
    throw new Error(data.error?.message || 'Failed to get response from Claude.');
  }
}