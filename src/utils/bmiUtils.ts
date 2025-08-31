import { BMIResult } from '../types';

export const calculateBMI = (
  height: number, 
  weight: number, 
  heightUnit: string, 
  weightUnit: string
): BMIResult => {
  try {
    // Validate inputs
    if (!height || !weight || height <= 0 || weight <= 0) {
      throw new Error('Invalid height or weight values');
    }

    if (!heightUnit || !weightUnit) {
      throw new Error('Missing unit specifications');
    }

  // Convert to metric units (kg and meters)
  let weightInKg = weight;
  let heightInM = height;

  // Convert weight to kg if needed
  if (weightUnit === 'lbs') {
    weightInKg = weight * 0.453592;
  }

  // Convert height to meters if needed
  if (heightUnit === 'cm') {
    heightInM = height / 100;
  } else if (heightUnit === 'ft') {
    heightInM = height * 0.3048;
  }

  // Calculate BMI
  const bmi = weightInKg / (heightInM * heightInM);
  
  // Validate BMI result
  if (!isFinite(bmi) || bmi <= 0) {
    throw new Error('Invalid BMI calculation result');
  }
  
  const roundedBMI = Math.round(bmi * 10) / 10;

  // Determine category
  let category: string;
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal weight';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
  } else {
    category = 'Obese';
  }

  return {
    bmi: roundedBMI,
    category
  };
  } catch (error) {
    console.error('BMI calculation error:', error);
    throw new Error('Failed to calculate BMI. Please check your inputs.');
  }
};

export const getBMIRange = (category: string): string => {
  if (!category) return 'Unknown';
  
  switch (category) {
    case 'Underweight':
      return '< 18.5';
    case 'Normal weight':
      return '18.5 - 24.9';
    case 'Overweight':
      return '25.0 - 29.9';
    case 'Obese':
      return '≥ 30.0';
    default:
      return 'Unknown';
  }
};