-- Create the user_records table (if it doesn't exist)
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

-- Create indexes (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_user_records_email ON user_records(email);
CREATE INDEX IF NOT EXISTS idx_user_records_created_at ON user_records(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE user_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists, then create new one
DROP POLICY IF EXISTS "Allow all operations on user_records" ON user_records;
CREATE POLICY "Allow all operations on user_records" ON user_records
  FOR ALL USING (true);

-- Create function for updating timestamps (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger (drop first if exists)
DROP TRIGGER IF EXISTS update_user_records_updated_at ON user_records;
CREATE TRIGGER update_user_records_updated_at 
  BEFORE UPDATE ON user_records 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
