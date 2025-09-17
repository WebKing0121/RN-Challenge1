# Journal App Setup Instructions

## Prerequisites
- Node.js and npm installed
- Expo CLI installed (`npm install -g @expo/cli`)
- Android Studio and Android Emulator running
- Supabase account

## Supabase Setup

### Option 1: Quick Start (Mock Mode)
The app will work in mock mode without Supabase configuration. You can test the UI and navigation, but data won't persist.

### Option 2: Full Setup with Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env` file in the project root:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Or update `lib/supabase.ts` directly with your credentials

4. Create the `journal_entries` table in your Supabase SQL editor:
   ```sql
   CREATE TABLE journal_entries (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     content TEXT NOT NULL,
     mood TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

   -- Create policy to allow users to only see their own entries
   CREATE POLICY "Users can view own entries" ON journal_entries
     FOR SELECT USING (auth.uid() = user_id);

   -- Create policy to allow users to insert their own entries
   CREATE POLICY "Users can insert own entries" ON journal_entries
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   -- Create policy to allow users to update their own entries
   CREATE POLICY "Users can update own entries" ON journal_entries
     FOR UPDATE USING (auth.uid() = user_id);

   -- Create policy to allow users to delete their own entries
   CREATE POLICY "Users can delete own entries" ON journal_entries
     FOR DELETE USING (auth.uid() = user_id);
   ```

## Running the App

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run android
   ```

3. The app will launch in your Android emulator

## Features

- **Authentication**: Email/password login with automatic registration
- **Journal List**: View all entries with mood filtering
- **New Entry**: Write entries with AI mood analysis
- **Journal Detail**: View full entry details
- **Mood Analysis**: Simple keyword-based mood detection (easily replaceable with real LLM API)

## Project Structure

```
├── App.tsx                     # Main app component
├── lib/
│   ├── supabase.ts            # Supabase configuration
│   └── moodAnalyzer.ts        # Mood analysis utility
├── contexts/
│   └── AuthContext.tsx        # Authentication context
├── navigation/
│   └── AppNavigator.tsx       # Navigation setup
└── screens/
    ├── AuthScreen.tsx         # Login/Register screen
    ├── JournalListScreen.tsx  # List of journal entries
    ├── NewEntryScreen.tsx     # Create new entry
    └── JournalDetailScreen.tsx # View entry details
```

## Customization

- Replace the mock mood analysis in `lib/moodAnalyzer.ts` with a real LLM API
- Update the UI styling in the StyleSheet objects
- Add more mood categories or analysis features
- Implement entry editing functionality
