import { supabase } from '../lib/supabase';
import { PersonalDetails, BMIData } from '../types';

export interface EmailResult {
  success: boolean;
  message: string;
  emailId?: string;
  error?: string;
}

export class EmailService {
  static async sendBMIResults(personalDetails: PersonalDetails, bmiData: BMIData): Promise<EmailResult> {
    try {
      const { data, error } = await supabase.functions.invoke('send-bmi-email', {
        body: {
          to: personalDetails.email,
          name: personalDetails.name,
          bmi: bmiData.bmi,
          category: bmiData.category,
          height: bmiData.height,
          weight: bmiData.weight,
          heightUnit: bmiData.heightUnit,
          weightUnit: bmiData.weightUnit,
          age: personalDetails.age,
          gender: personalDetails.gender,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        return {
          success: false,
          message: 'Failed to send email',
          error: error.message,
        };
      }

      return {
        success: true,
        message: 'Email sent successfully!',
        emailId: data?.emailId,
      };
    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
