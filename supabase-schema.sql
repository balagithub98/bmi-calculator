-- Create the bmi_entries table
CREATE TABLE IF NOT EXISTS bmi_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Changed from UUID to TEXT to support anonymous session IDs
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  height_cm DECIMAL(5,2) NOT NULL CHECK (height_cm > 0),
  weight_kg DECIMAL(5,2) NOT NULL CHECK (weight_kg > 0),
  unit_system TEXT NOT NULL CHECK (unit_system IN ('metric', 'imperial')),
  bmi DECIMAL(4,2) NOT NULL CHECK (bmi > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bmi_entries_user_id ON bmi_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_bmi_entries_created_at ON bmi_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bmi_entries_email ON bmi_entries(email);

-- Enable Row Level Security (RLS)
ALTER TABLE bmi_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for anonymous access
-- Allow anyone to insert records (anonymous users)
CREATE POLICY "Allow anonymous insert" ON bmi_entries
  FOR INSERT WITH CHECK (true);

-- Allow users to view their own records (based on session ID)
CREATE POLICY "Allow view own records" ON bmi_entries
  FOR SELECT USING (true); -- Allow viewing all records for simplicity

-- Allow users to update their own records
CREATE POLICY "Allow update own records" ON bmi_entries
  FOR UPDATE USING (true); -- Allow updating all records for simplicity

-- Allow users to delete their own records
CREATE POLICY "Allow delete own records" ON bmi_entries
  FOR DELETE USING (true); -- Allow deleting all records for simplicity
