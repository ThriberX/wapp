import { NextResponse } from 'next/server';
import { callGeminiAPI } from '@/lib/gemini';

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    
    const response = await callGeminiAPI(prompt);
    
    if (response && response.result) {
      return NextResponse.json({ 
        result: response.result, 
        modelUsed: 'gemini' 
      }, { status: 200 });
    }
    
    throw new Error('Invalid response from Gemini');
    
  } catch (error) {
    console.error('Gemini API failed:', error.message);
    return NextResponse.json({ 
      error: 'Gemini API failed', 
      details: error.message 
    }, { status: 500 });
  }
}