import { NextResponse } from 'next/server';

export async function callClaudeAPI(prompt) {
  
  const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY; 

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

export async function callGeminiAPI(prompt) {

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured.');
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`;
  const headers = { 'Content-Type': 'application/json' };
  const requestBody = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();

  if (response.ok) {
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!result) throw new Error('No content received from Gemini.');
    return { result };
  } else {
    const errorMessage = data.error?.message || 'Failed to get response from Gemini.';
    throw new Error(errorMessage);
  }
}

export async function callOpenAIAPI(prompt) {
  
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured.');
  }

  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const headers = {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  };
  const requestBody = {
    model: 'gpt-3.5-turbo',
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
    const result = data.choices?.[0]?.message?.content;
    if (!result) throw new Error('No content received from OpenAI.');
    return { result };
  } else {
    throw new Error(data.error?.message || 'Failed to get response from OpenAI.');
  }
}