import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function callGeminiAPI(prompt) {
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
    throw new Error(data.error?.message || 'Failed to get response from Gemini.');
  }
}