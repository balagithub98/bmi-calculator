# BMI Calculator with Supabase

A modern BMI calculator built with React, TypeScript, and Supabase for user authentication and data persistence.

## Features

- 🔐 **User Authentication** - Sign up, sign in, and sign out functionality
- 📊 **BMI Calculation** - Calculate BMI with metric or imperial units
- 💾 **Data Persistence** - Save BMI entries to Supabase database
- 📈 **History Tracking** - View your BMI calculation history
- 🛡️ **Row Level Security** - Users can only access their own data
- 🎨 **Modern UI** - Beautiful design with Tailwind CSS
- 📱 **Responsive** - Works on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Icons**: Lucide React
- **Linting**: ESLint

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd bmi-calculator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project settings and copy the following values:
   - Project URL
   - Anon/public key

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script to create the `bmi_entries` table and RLS policies

### 6. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Database Schema

The `bmi_entries` table includes:

- `id` - Unique identifier (UUID)
- `user_id` - References auth.users(id)
- `full_name` - User's full name
- `email` - User's email
- `age` - User's age
- `gender` - User's gender (male/female/other)
- `height_cm` - Height in centimeters
- `weight_kg` - Weight in kilograms
- `unit_system` - Original unit system (metric/imperial)
- `bmi` - Calculated BMI value
- `created_at` - Timestamp of creation

## Security Features

- **Row Level Security (RLS)** - Users can only access their own data
- **Authentication Required** - All database operations require user authentication
- **No Service Role Keys** - Frontend only uses anon key for security
- **Input Validation** - All form inputs are validated
- **Error Handling** - Graceful error handling throughout the app

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # React components
│   ├── Auth.tsx        # Authentication component
│   ├── BMICalculator.tsx # Main calculator component
│   ├── BMIForm.tsx     # BMI calculation form
│   ├── BMIHistory.tsx  # History display component
│   ├── PersonalDetailsForm.tsx # Personal details form
│   └── ResultsDisplay.tsx # Results display component
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/               # Library configurations
│   └── supabase.ts    # Supabase client
├── services/          # Service layer
│   └── bmiService.ts  # BMI database operations
├── types/             # TypeScript type definitions
│   └── index.ts       # Shared types
└── utils/             # Utility functions
    └── bmiUtils.ts    # BMI calculation utilities
```

## Usage

1. **Sign Up/In**: Create an account or sign in with existing credentials
2. **Enter Personal Details**: Provide your name, email, age, and gender
3. **Calculate BMI**: Enter your height and weight (metric or imperial)
4. **View Results**: See your BMI value, category, and health recommendations
5. **Save Entry**: Your BMI entry is automatically saved to the database
6. **View History**: Access your previous BMI calculations from the history page

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details
