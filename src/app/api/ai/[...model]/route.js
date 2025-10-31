import { NextResponse } from 'next/server';
import { 
  callClaudeAPI, 
  callGeminiAPI, 
  callOpenAIAPI 
} from '@/lib/ai-calls'; 

const apiCallers = {
  'claude': callClaudeAPI,
  'gemini': callGeminiAPI,
  'openai': callOpenAIAPI,
};

export async function POST(req, { params }) {
  try {
  
    const resolvedParams = await params;
    const modelName = resolvedParams.model?.[0]?.toLowerCase();
    
    const { prompt } = await req.json();

    if (!modelName || !apiCallers[modelName]) {
      return NextResponse.json(
        { 
          error: 'Invalid model specified', 
          details: `Valid models are: ${Object.keys(apiCallers).join(', ')}` 
        }, 
        { status: 400 }
      );
    }
    
    const callerFunction = apiCallers[modelName];
    const response = await callerFunction(prompt);

    if (response && response.result) {
      return NextResponse.json(
        { 
          result: response.result, 
          modelUsed: modelName 
        }, 
        { status: 200 }
      );
    }
    
    throw new Error(`Invalid response from ${modelName}`);
    
  } catch (error) {
    console.error(`API failed:`, error.message);
    return NextResponse.json(
      { 
        error: `API call failed`, 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}