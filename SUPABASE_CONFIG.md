# Supabase Configuration for Login Without Email Verification

To enable login functionality without email verification, you need to configure your Supabase project settings.

## Steps to Disable Email Confirmation

### 1. Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `gboctlvwfmbehtxvelxz`

### 2. Configure Authentication Settings
1. Navigate to **Authentication** → **Settings** in the left sidebar
2. Scroll down to **User Signups** section
3. **Disable** the "Enable email confirmations" toggle
4. Click **Save** to apply changes

### 3. Optional: Configure Email Templates (if needed later)
If you want to customize email templates for future use:
1. Go to **Authentication** → **Email Templates**
2. Customize the templates as needed

### 4. Verify Configuration
After making these changes:
- New user registrations will not require email confirmation
- Users can sign in immediately after registration
- The app will work with the real Supabase backend

## Database Setup
Make sure you've run the SQL setup script in your Supabase SQL Editor:
```sql
-- Copy and paste the contents of supabase_setup.sql
-- This creates the journal_entries table and RLS policies
```

## Environment Variables
Ensure your `.env` file contains the correct Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=https://gboctlvwfmbehtxvelxz.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Testing
After configuration:
1. Try registering a new user
2. Verify immediate login without email confirmation
3. Test journal entry creation and retrieval

---
**Note**: Disabling email confirmation is suitable for development and testing. For production apps, consider implementing proper email verification for security.