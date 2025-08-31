-- Create the user_records table
CREATE TABLE IF NOT EXISTS user_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  height DECIMAL(5,2) NOT NULL CHECK (height > 0),
  height_unit TEXT NOT NULL CHECK (height_unit IN ('cm', 'ft')),
  weight DECIMAL(5,2) NOT NULL CHECK (weight > 0),
  weight_unit TEXT NOT NULL CHECK (weight_unit IN ('kg', 'lbs')),
  bmi DECIMAL(4,2) NOT NULL CHECK (bmi > 0),
  bmi_category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster queries
CREATE INDEX IF NOT EXISTS idx_user_records_email ON user_records(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_user_records_created_at ON user_records(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE user_records ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for demo purposes)
-- In production, you might want to restrict this based on user authentication
CREATE POLICY "Allow all operations on user_records" ON user_records
  FOR ALL USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_user_records_updated_at 
  BEFORE UPDATE ON user_records 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
