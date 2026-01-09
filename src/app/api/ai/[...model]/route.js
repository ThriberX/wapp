import { NextResponse } from 'next/server';
import { callAI } from '@/lib/ai-calls';

export const runtime = 'edge';

export async function POST(req, { params }) {
  try {
    const resolvedParams = await params;
    const modelName = resolvedParams.model?.[0]?.toLowerCase();
    const { prompt } = await req.json();

    if (!modelName) {
      return NextResponse.json(
        { error: 'Model name is required' }, 
        { status: 400 }
      );
    }

    const response = await callAI(modelName, prompt);

    return NextResponse.json(
      { 
        result: response.result, 
        modelUsed: modelName 
      }, 
      { status: 200 }
    );
    
  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json(
      { 
        error: 'API call failed', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}
