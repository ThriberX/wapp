import { NextResponse } from 'next/server';

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

export async function POST(req) {
  const { prompt } = await req.json();

  if (!CLAUDE_API_KEY) {
    return NextResponse.json(
      { error: 'Claude API key is not configured.' },
      { status: 500 }
    );
  }

  const requestBody = {
    model: 'claude-3-haiku-20240307', 
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: 1024,
  };

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data, { status: 200 });
    } else {
      console.error('Error from Claude API:', data.error);
      return NextResponse.json({ error: data.error }, { status: response.status });
    }
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Claude API.' },
      { status: 500 }
    );
  }
}
