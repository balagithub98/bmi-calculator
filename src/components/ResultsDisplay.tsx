import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PersonalDetails, BMIData } from '../types';
import { RotateCcw, Heart, AlertTriangle, CheckCircle, XCircle, Mail } from 'lucide-react';
import { BMIService } from '../services/bmiService';
import { EmailService } from '../services/emailService';

// Global save lock to prevent concurrent saves
let globalSaveInProgress = false;

interface ResultsDisplayProps {
  personalDetails: PersonalDetails;
  bmiData: BMIData;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ personalDetails, bmiData, onReset }) => {
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [hasSaved, setHasSaved] = useState(false);
  const saveAttemptedRef = useRef(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const saveBMIEntry = useCallback(async () => {
    // Prevent double saves with global lock
    if (hasSaved || saving || globalSaveInProgress) {
      console.log('Save blocked - already saved, currently saving, or global save in progress');
      return;
    }

    // Create a unique identifier for this save operation
    const saveId = `${personalDetails.email}-${bmiData.bmi}-${Date.now()}`;
    console.log('Attempting to save BMI entry:', saveId);
    console.log('Personal Details:', personalDetails);
    console.log('BMI Data:', bmiData);

    try {
      globalSaveInProgress = true;
      setSaving(true);
      setSaveStatus('idle');
      
      const result = await BMIService.saveBMIEntry(personalDetails, bmiData);
      console.log('Save result:', result);
      
      if (result) {
        setSaveStatus('success');
        setHasSaved(true); // Mark as saved to prevent duplicates
        console.log('BMI entry saved successfully:', saveId);
      } else {
        console.log('Save returned null - Supabase not configured');
        setSaveStatus('error');
      }
    } catch (error: unknown) {
      console.error('Error saving BMI entry:', error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
      globalSaveInProgress = false;
    }
  }, [personalDetails, bmiData]);

  const sendEmail = useCallback(async () => {
    if (sendingEmail) return;

    try {
      setSendingEmail(true);
      setEmailStatus('idle');

      const result = await EmailService.sendBMIResults(personalDetails, bmiData);
      
      if (result.success) {
        setEmailStatus('success');
      } else {
        setEmailStatus('error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailStatus('error');
    } finally {
      setSendingEmail(false);
    }
  }, [personalDetails, bmiData, sendingEmail]);

  // Automatic save on component mount
  useEffect(() => {
    // Only save once when component mounts
    if (!saveAttemptedRef.current) {
      saveAttemptedRef.current = true;
      saveBMIEntry();
    }
  }, [saveBMIEntry]);
  const getBMICategoryInfo = (category: string) => {
    switch (category) {
      case 'Underweight':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          icon: <AlertTriangle className="w-6 h-6" />,
          message: 'You may want to gain some weight for optimal health.',
          recommendations: [
            'Consult with a healthcare provider about healthy weight gain',
            'Focus on nutrient-dense foods',
            'Consider strength training exercises'
          ]
        };
      case 'Normal weight':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: <CheckCircle className="w-6 h-6" />,
          message: 'Great job! You\'re in the healthy weight range.',
          recommendations: [
            'Maintain your current lifestyle',
            'Continue regular physical activity',
            'Keep eating a balanced diet'
          ]
        };
      case 'Overweight':
        return {
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          icon: <AlertTriangle className="w-6 h-6" />,
          message: 'Consider making some lifestyle changes for better health.',
          recommendations: [
            'Increase physical activity',
            'Focus on portion control',
            'Choose nutrient-dense, lower-calorie foods'
          ]
        };
      case 'Obese':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: <XCircle className="w-6 h-6" />,
          message: 'It\'s important to consult with a healthcare provider.',
          recommendations: [
            'Speak with a doctor about weight management',
            'Consider a structured diet and exercise plan',
            'Focus on gradual, sustainable changes'
          ]
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: <Heart className="w-6 h-6" />,
          message: 'Please consult with a healthcare provider.',
          recommendations: []
        };
    }
  };

  const categoryInfo = getBMICategoryInfo(bmiData.category);

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your BMI Results</h2>
        <p className="text-gray-600">Here's your personalized health assessment</p>
      </div>

      {/* Personal Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Name:</span>
            <span className="ml-2 font-medium">{personalDetails.name}</span>
          </div>
          <div>
            <span className="text-gray-600">Age:</span>
            <span className="ml-2 font-medium">{personalDetails.age} years</span>
          </div>
          <div>
            <span className="text-gray-600">Gender:</span>
            <span className="ml-2 font-medium capitalize">{personalDetails.gender}</span>
          </div>
          <div>
            <span className="text-gray-600">Email:</span>
            <span className="ml-2 font-medium">{personalDetails.email}</span>
          </div>
        </div>
      </div>

      {/* BMI Result */}
      <div className="text-center mb-6">
        <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-8 py-4 mb-4">
          <div className="text-3xl font-bold">{bmiData.bmi}</div>
          <div className="text-sm opacity-90">BMI</div>
        </div>
        
        <div className={`inline-flex items-center px-4 py-2 rounded-full border ${categoryInfo.bgColor} ${categoryInfo.borderColor} ${categoryInfo.color}`}>
          {categoryInfo.icon}
          <span className="ml-2 font-medium">{bmiData.category}</span>
        </div>
      </div>

      {/* BMI Scale */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">BMI Scale</h3>
        <div className="space-y-2">
          {[
            { range: '< 18.5', category: 'Underweight', color: 'bg-blue-500' },
            { range: '18.5 - 24.9', category: 'Normal weight', color: 'bg-green-500' },
            { range: '25.0 - 29.9', category: 'Overweight', color: 'bg-orange-500' },
            { range: '≥ 30.0', category: 'Obese', color: 'bg-red-500' }
          ].map((item) => (
            <div key={item.category} className={`flex items-center p-3 rounded-lg ${
              item.category === bmiData.category ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className={`w-4 h-4 rounded-full ${item.color} mr-3`}></div>
              <div className="flex-1">
                <span className="font-medium">{item.category}</span>
                <span className="text-gray-600 ml-2">({item.range})</span>
              </div>
              {item.category === bmiData.category && (
                <span className="text-blue-600 font-semibold text-sm bg-blue-100 px-2 py-1 rounded-full">← You are here</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Health Message */}
      <div className={`rounded-lg border p-6 mb-6 ${categoryInfo.bgColor} ${categoryInfo.borderColor}`}>
        <div className="flex items-start">
          <div className={categoryInfo.color}>
            {categoryInfo.icon}
          </div>
          <div className="ml-3">
            <h3 className={`font-semibold ${categoryInfo.color} mb-2`}>Health Assessment</h3>
            <p className="text-gray-700 mb-4">{categoryInfo.message}</p>
            {categoryInfo.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Recommendations:</h4>
                <ul className="space-y-1">
                  {categoryInfo.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Measurement Summary */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Measurements</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {bmiData.height} {bmiData.heightUnit}
            </div>
            <div className="text-gray-600">Height</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {bmiData.weight} {bmiData.weightUnit}
            </div>
            <div className="text-gray-600">Weight</div>
          </div>
        </div>
      </div>

      {/* Save Status */}
      {saving && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <p className="text-blue-800">Saving your BMI entry...</p>
          </div>
        </div>
      )}
      
      {saveStatus === 'success' && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800">BMI entry saved successfully!</p>
          </div>
        </div>
      )}
      
      {saveStatus === 'error' && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800">Failed to save BMI entry. Please try again.</p>
          </div>
        </div>
      )}

      {/* Email Status */}
      {sendingEmail && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <p className="text-blue-800">Sending email...</p>
          </div>
        </div>
      )}
      
      {emailStatus === 'success' && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800">Email sent successfully! Check your inbox.</p>
          </div>
        </div>
      )}
      
      {emailStatus === 'error' && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800">Failed to send email. Please try again.</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {saveStatus === 'error' && (
          <button
            onClick={saveBMIEntry}
            disabled={saving}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Retrying...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Retry Save
              </>
            )}
          </button>
        )}

        <button
          onClick={sendEmail}
          disabled={sendingEmail || emailStatus === 'success'}
          className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
        >
          {sendingEmail ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending...
            </>
          ) : emailStatus === 'success' ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Email Sent
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </>
          )}
        </button>
        
        <button
          onClick={() => {
            try {
              onReset();
            } catch (err) {
              console.error('Error resetting:', err);
            }
          }}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Start Over
        </button>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Disclaimer:</strong> This BMI calculator is for informational purposes only and should not replace professional medical advice. 
          Always consult with a healthcare provider for personalized health guidance.
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;