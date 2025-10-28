import { NextResponse } from 'next/server';
import { callOpenAIAPI } from '@/lib/openai';

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    
    const response = await callOpenAIAPI(prompt);
    
    if (response && response.result) {
      return NextResponse.json({ 
        result: response.result, 
        modelUsed: 'openai' 
      }, { status: 200 });
    }
    
    throw new Error('Invalid response from OpenAI');
    
  } catch (error) {
    console.error('OpenAI API failed:', error.message);
    return NextResponse.json({ 
      error: 'OpenAI API failed', 
      details: error.message 
    }, { status: 500 });
  }
}