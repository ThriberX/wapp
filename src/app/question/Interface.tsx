export interface AIResponse {
  completion?: { content: string };
  content?: Array<{ text: string }>;
  response?: string;
  text?: string;
  result?: string; 
  modelUsed?: string; 
  error?: string; 
}

export class AIInterface {
  private static instance: AIInterface;
  private models = ['/api/claude', '/api/gemini', '/api/openai']; 
  
  public static getInstance(): AIInterface {
    if (!AIInterface.instance) {
      AIInterface.instance = new AIInterface();
    }
    return AIInterface.instance;
  }

  async chatWithAI(prompt: string): Promise<string> {
   
    for (const endpoint of this.models) {
      try {
        console.log(`Trying: ${endpoint}`);
        
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        if (!res.ok) throw new Error(`${endpoint} failed`);
        
        const data: AIResponse = await res.json();
        
        const response = 
          data.result ||           
          data.completion?.content || 
          data.content?.[0]?.text || 
          data.response || 
          data.text;
        
        if (response) {
          console.log(`Success with: ${endpoint}`);
          return response;
        }
        
        throw new Error('Invalid response format');
        
      } catch (error) {
        console.log(`${endpoint} failed, trying next...`);
        continue;
      }
    }
    
    throw new Error('All AI services failed');
  }

  async getQuizSuggestion(answers: string[], tree: any): Promise<string> {
    const history = answers.map((answer, index) => {
      const questionId = Object.keys(tree)[index];
      const question = tree[questionId]?.question;
      return `Q: ${question} A: ${answer}`;
    }).join('\n');
    
    const prompt = `You are ThriberX consultant. Give one encouraging sentence based on:\n${history}`;
    
    return await this.chatWithAI(prompt);
  }
}

export const aiInterface = AIInterface.getInstance();

export async function askAI(prompt: string): Promise<string> {
  return await aiInterface.chatWithAI(prompt);
}

export async function getAIQuizAdvice(answers: string[], tree: any, sessionId: string): Promise<string> {
  return await aiInterface.getQuizSuggestion(answers, tree);
}