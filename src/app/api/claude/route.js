import { NextResponse } from 'next/server';
import { callClaudeAPI } from '@/lib/claude';

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    
    const response = await callClaudeAPI(prompt);
    
    if (response && response.result) {
      return NextResponse.json({ 
        result: response.result, 
        modelUsed: 'claude' 
      }, { status: 200 });
    }
    
    throw new Error('Invalid response from Claude');
    
  } catch (error) {
    console.error('Claude API failed:', error.message);
    return NextResponse.json({ 
      error: 'Claude API failed', 
      details: error.message 
    }, { status: 500 });
  }
}