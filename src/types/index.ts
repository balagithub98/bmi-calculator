export interface PersonalDetails {
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

export interface BMIData {
  height: number;
  weight: number;
  heightUnit: string;
  weightUnit: string;
  bmi: number;
  category: string;
}

export interface BMIResult {
  bmi: number;
  category: string;
}