import { supabase, UserRecord } from '../lib/supabase';
import { PersonalDetails, BMIData } from '../types';

export class UserService {
  static async saveUserRecord(personalDetails: PersonalDetails, bmiData: BMIData): Promise<UserRecord | null> {
    try {
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Supabase environment variables not configured. Skipping save.');
        return null;
      }

      const { data, error } = await supabase
        .from('user_records')
        .insert({
          name: personalDetails.name,
          email: personalDetails.email,
          age: personalDetails.age,
          gender: personalDetails.gender,
          height: bmiData.height,
          height_unit: bmiData.heightUnit,
          weight: bmiData.weight,
          weight_unit: bmiData.weightUnit,
          bmi: bmiData.bmi,
          bmi_category: bmiData.category,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving user record:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to save user record:', error);
      return null;
    }
  }

  static async getUserRecords(email: string): Promise<UserRecord[]> {
    try {
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Supabase environment variables not configured. Returning empty array.');
        return [];
      }

      const { data, error } = await supabase
        .from('user_records')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user records:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch user records:', error);
      return [];
    }
  }

  static async getRecentRecords(limit: number = 10): Promise<UserRecord[]> {
    try {
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Supabase environment variables not configured. Returning empty array.');
        return [];
      }

      const { data, error } = await supabase
        .from('user_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent records:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch recent records:', error);
      return [];
    }
  }
}
