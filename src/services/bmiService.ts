import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PersonalDetails, BMIData } from '../types';

export interface BMIEntry {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  unit_system: 'metric' | 'imperial';
  bmi: number;
  created_at: string;
}

export class BMIService {
  // Convert imperial measurements to metric
  private static convertToMetric(height: number, weight: number, heightUnit: string, weightUnit: string) {
    let heightCm = height;
    let weightKg = weight;

    if (heightUnit === 'ft') {
      heightCm = height * 30.48; // Convert feet to cm
    }

    if (weightUnit === 'lbs') {
      weightKg = weight * 0.453592; // Convert lbs to kg
    }

    return { heightCm, weightKg };
  }

  // Generate a unique session ID for anonymous users
  private static getSessionId(): string {
    let sessionId = localStorage.getItem('bmi_session_id');
    if (!sessionId) {
      // Create a more unique session ID with timestamp and random string
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const browserInfo = navigator.userAgent.substring(0, 10);
      sessionId = `anon_${timestamp}_${randomStr}_${browserInfo}`;
      localStorage.setItem('bmi_session_id', sessionId);
    }
    return sessionId;
  }

  // Save BMI entry to database
  static async saveBMIEntry(personalDetails: PersonalDetails, bmiData: BMIData): Promise<BMIEntry | null> {
    try {
      console.log('BMIService.saveBMIEntry called');
      console.log('Supabase configured:', isSupabaseConfigured());
      
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured. Skipping save.');
        return null;
      }

      // Generate a unique session ID for anonymous users
      const sessionId = this.getSessionId();
      console.log('Session ID:', sessionId);

      // Convert measurements to metric if needed
      const { heightCm, weightKg } = this.convertToMetric(
        bmiData.height,
        bmiData.weight,
        bmiData.heightUnit,
        bmiData.weightUnit
      );
      console.log('Converted measurements - Height (cm):', heightCm, 'Weight (kg):', weightKg);

      const unitSystem = bmiData.heightUnit === 'cm' && bmiData.weightUnit === 'kg' ? 'metric' : 'imperial';
      console.log('Unit system:', unitSystem);

      const insertData = {
        user_id: sessionId, // Use session ID instead of authenticated user ID
        full_name: personalDetails.name,
        email: personalDetails.email,
        age: personalDetails.age,
        gender: personalDetails.gender,
        height_cm: heightCm,
        weight_kg: weightKg,
        unit_system: unitSystem,
        bmi: bmiData.bmi,
      };
      console.log('Inserting data:', insertData);

      const { data, error } = await supabase
        .from('bmi_entries')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error saving BMI entry:', error);
        throw error;
      }

      console.log('Successfully saved BMI entry:', data);
      return data;
    } catch (error) {
      console.error('Failed to save BMI entry:', error);
      throw error;
    }
  }

  // Get user's BMI history
  static async getBMIHistory(): Promise<BMIEntry[]> {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured. Returning empty history.');
        return [];
      }

      // Get session ID for anonymous users
      const sessionId = this.getSessionId();

      const { data, error } = await supabase
        .from('bmi_entries')
        .select('*')
        .eq('user_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching BMI history:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch BMI history:', error);
      throw error;
    }
  }

  // Delete a BMI entry
  static async deleteBMIEntry(entryId: string): Promise<void> {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured. Skipping delete.');
        return;
      }

      // Get session ID for anonymous users
      const sessionId = this.getSessionId();

      const { error } = await supabase
        .from('bmi_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', sessionId); // Only allow deletion of own entries

      if (error) {
        console.error('Error deleting BMI entry:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to delete BMI entry:', error);
      throw error;
    }
  }

  // Clear session data (for testing/reset purposes)
  static clearSession(): void {
    localStorage.removeItem('bmi_session_id');
  }
}
