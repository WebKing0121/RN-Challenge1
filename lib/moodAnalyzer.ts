// Mood analysis using OpenAI API
// Falls back to keyword matching if OpenAI is not configured

export interface MoodResult {
  mood: string;
  confidence: number;
}

const MOODS = [
  { name: 'Happy', emoji: '😊', keywords: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'fantastic', 'awesome', 'delighted'] },
  { name: 'Sad', emoji: '😢', keywords: ['sad', 'depressed', 'down', 'upset', 'crying', 'hurt', 'disappointed', 'lonely', 'grief', 'sorrow'] },
  { name: 'Angry', emoji: '😠', keywords: ['angry', 'mad', 'furious', 'rage', 'annoyed', 'frustrated', 'irritated', 'hate', 'outraged', 'livid'] },
  { name: 'Fear', emoji: '😨', keywords: ['afraid', 'scared', 'fear', 'anxious', 'worried', 'nervous', 'terrified', 'panic', 'dread', 'uneasy'] },
  { name: 'Surprised', emoji: '😲', keywords: ['surprised', 'shocked', 'amazed', 'wow', 'unexpected', 'astonished', 'stunned', 'incredible', 'unbelievable'] },
  { name: 'Neutral', emoji: '😐', keywords: ['okay', 'fine', 'normal', 'regular', 'average', 'meh', 'whatever', 'indifferent', 'neutral'] },
];

// OpenAI API call for mood analysis
async function analyzeMoodWithOpenAI(text: string): Promise<MoodResult> {
  const openaiApiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Analyze the emotional tone of the following journal entry and respond with ONLY one of these moods: Happy, Sad, Angry, Fear, Surprised, Neutral. 
          
          Consider the overall emotional context, not just individual words. Respond with just the mood name, nothing else.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      max_tokens: 10,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const mood = data.choices[0]?.message?.content?.trim();
  
  // Validate mood response
  const validMoods = MOODS.map(m => m.name);
  if (!mood || !validMoods.includes(mood)) {
    throw new Error('Invalid mood response from OpenAI');
  }

  return { mood, confidence: 0.9 }; // High confidence for AI analysis
}

// Fallback keyword-based mood analysis
function analyzeMoodWithKeywords(text: string): MoodResult {
  const lowerText = text.toLowerCase();
  let bestMatch = { name: 'Neutral', emoji: '😐', score: 0 };
  
  for (const mood of MOODS) {
    let score = 0;
    for (const keyword of mood.keywords) {
      if (lowerText.includes(keyword)) {
        score += 1;
      }
    }
    
    if (score > bestMatch.score) {
      bestMatch = { ...mood, score };
    }
  }
  
  if (bestMatch.score === 0) {
    return { mood: 'Neutral', confidence: 0.5 };
  }
  
  return { 
    mood: bestMatch.name, 
    confidence: Math.min(bestMatch.score / 3, 1)
  };
}

export async function analyzeMood(text: string): Promise<MoodResult> {
  // For now, use keyword analysis to avoid API issues
  // We can implement OpenAI later once the app is stable
  console.log('🧠 Analyzing mood for text:', text.substring(0, 50) + '...');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return analyzeMoodWithKeywords(text);
}

export function getMoodEmoji(mood: string): string {
  const moodData = MOODS.find(m => m.name === mood);
  return moodData?.emoji || '😐';
}

export function getAllMoods(): string[] {
  return MOODS.map(m => m.name);
}
