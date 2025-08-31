import React, { useState } from 'react';
import { PersonalDetails, BMIData } from '../types';
import { ArrowLeft, Ruler, Weight, AlertCircle } from 'lucide-react';
import { calculateBMI } from '../utils/bmiUtils';

interface BMIFormProps {
  onSubmit: (data: BMIData) => void;
  onBack: () => void;
  personalDetails: PersonalDetails | null;
}

const BMIForm: React.FC<BMIFormProps> = ({ onSubmit, onBack, personalDetails }) => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    heightUnit: 'cm',
    weightUnit: 'kg'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    try {
      const newErrors: Record<string, string> = {};

      if (!formData.height) {
        newErrors.height = 'Height is required';
      } else {
        const height = parseFloat(formData.height);
        if (isNaN(height)) {
          newErrors.height = 'Please enter a valid number for height';
        } else if (formData.heightUnit === 'cm' && (height < 50 || height > 300)) {
          newErrors.height = 'Please enter a valid height (50-300 cm)';
        } else if (formData.heightUnit === 'ft' && (height < 1.6 || height > 9.8)) {
          newErrors.height = 'Please enter a valid height (1.6-9.8 ft)';
        }
      }

      if (!formData.weight) {
        newErrors.weight = 'Weight is required';
      } else {
        const weight = parseFloat(formData.weight);
        if (isNaN(weight)) {
          newErrors.weight = 'Please enter a valid number for weight';
        } else if (formData.weightUnit === 'kg' && (weight < 20 || weight > 500)) {
          newErrors.weight = 'Please enter a valid weight (20-500 kg)';
        } else if (formData.weightUnit === 'lbs' && (weight < 44 || weight > 1100)) {
          newErrors.weight = 'Please enter a valid weight (44-1100 lbs)';
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } catch (err) {
      console.error('Validation error:', err);
      setErrors({ general: 'Validation failed. Please check your inputs.' });
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      if (validateForm()) {
        const height = parseFloat(formData.height);
        const weight = parseFloat(formData.weight);
        
        const bmiResult = calculateBMI(height, weight, formData.heightUnit, formData.weightUnit);
        
        onSubmit({
          height,
          weight,
          heightUnit: formData.heightUnit,
          weightUnit: formData.weightUnit,
          bmi: bmiResult.bmi,
          category: bmiResult.category
        });
      }
    } catch (err) {
      console.error('BMI calculation error:', err);
      setErrors({ general: 'Failed to calculate BMI. Please check your inputs and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    try {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    } catch (err) {
      console.error('Input change error:', err);
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Physical Measurements</h2>
        <p className="text-gray-600">
          Hello {personalDetails?.name}! Now let's calculate your BMI
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Height Field */}
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
            Height
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                id="height"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                step="0.1"
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.height ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={formData.heightUnit === 'cm' ? 'e.g., 170' : 'e.g., 5.7'}
              />
            </div>
            <select
              value={formData.heightUnit}
              onChange={(e) => handleInputChange('heightUnit', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="cm">cm</option>
              <option value="ft">ft</option>
            </select>
          </div>
          {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
        </div>

        {/* Weight Field */}
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
            Weight
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                id="weight"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                step="0.1"
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.weight ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={formData.weightUnit === 'kg' ? 'e.g., 70' : 'e.g., 154'}
              />
            </div>
            <select
              value={formData.weightUnit}
              onChange={(e) => handleInputChange('weightUnit', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
          {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <button
            type="submit"
           disabled={isSubmitting}
           className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
           {isSubmitting ? 'Calculating...' : 'Calculate BMI'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BMIForm;