import React, { useState } from 'react';
import PersonalDetailsForm from './PersonalDetailsForm';
import BMIForm from './BMIForm';
import ResultsDisplay from './ResultsDisplay';
import UserHistory from './UserHistory';
import { PersonalDetails, BMIData } from '../types';
import { Calculator, Users, AlertCircle } from 'lucide-react';

const BMICalculator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails | null>(null);
  const [bmiData, setBmiData] = useState<BMIData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handlePersonalDetailsSubmit = (details: PersonalDetails) => {
    try {
      setError(null);
      setPersonalDetails(details);
      setCurrentStep(2);
    } catch (err) {
      setError('Failed to save personal details. Please try again.');
      console.error('Error saving personal details:', err);
    }
  };

  const handleBMISubmit = (data: BMIData) => {
    try {
      setError(null);
      setBmiData(data);
      setCurrentStep(3);
    } catch (err) {
      setError('Failed to calculate BMI. Please check your inputs and try again.');
      console.error('Error calculating BMI:', err);
    }
  };

  const handleReset = () => {
    try {
      setError(null);
      setCurrentStep(1);
      setPersonalDetails(null);
      setBmiData(null);
    } catch (err) {
      setError('Failed to reset form. Please refresh the page.');
      console.error('Error resetting form:', err);
    }
  };

  const handleBackToStep = (step: number) => {
    try {
      setError(null);
      setCurrentStep(step);
    } catch (err) {
      setError('Navigation error. Please try again.');
      console.error('Error navigating:', err);
    }
  };

  const handleViewHistory = () => {
    try {
      setError(null);
      setShowHistory(true);
    } catch (err) {
      setError('Failed to load history. Please try again.');
      console.error('Error loading history:', err);
    }
  };



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">BMI Calculator</h1>
          <p className="text-gray-600 text-lg">Calculate your Body Mass Index and get personalized health insights</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              currentStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
            }`}>
              <Users className="w-5 h-5" />
            </div>
            <div className={`h-1 w-16 rounded-full transition-all duration-300 ${
              currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
            }`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              currentStep >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
            }`}>
              <Calculator className="w-5 h-5" />
            </div>
            <div className={`h-1 w-16 rounded-full transition-all duration-300 ${
              currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'
            }`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              currentStep >= 3 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
            }`}>
              ✓
            </div>
          </div>
        </div>

        {/* Main Content */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {currentStep === 1 && (
            <PersonalDetailsForm onSubmit={handlePersonalDetailsSubmit} />
          )}
          
          {currentStep === 2 && (
            <BMIForm 
              onSubmit={handleBMISubmit}
              onBack={() => handleBackToStep(1)}
              personalDetails={personalDetails}
            />
          )}
          
          {currentStep === 3 && personalDetails && bmiData && (
            <ResultsDisplay 
              personalDetails={personalDetails}
              bmiData={bmiData}
              onReset={handleReset}
              onViewHistory={handleViewHistory}
            />
          )}
          
          {showHistory && personalDetails && (
            <UserHistory 
              userEmail={personalDetails.email}
              onSelectRecord={() => {
                // For now, just go back to results
                setShowHistory(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;