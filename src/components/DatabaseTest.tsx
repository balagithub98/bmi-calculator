import React, { useState, useEffect } from 'react';
import { BMIService } from '../services/bmiService';
import { isSupabaseConfigured } from '../lib/supabase';

const DatabaseTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testDatabaseConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing...');

    try {
      // Test 1: Check if Supabase is configured
      const configured = isSupabaseConfigured();
      console.log('Supabase configured:', configured);
      
      if (!configured) {
        setTestResult('❌ Supabase not configured. Check environment variables.');
        return;
      }

      // Test 2: Try to save a test entry
      const testPersonalDetails = {
        name: 'Test User',
        email: 'test@example.com',
        age: 25,
        gender: 'male' as const
      };

      const testBMIData = {
        height: 170,
        weight: 70,
        heightUnit: 'cm' as const,
        weightUnit: 'kg' as const,
        bmi: 24.22,
        category: 'Normal weight'
      };

      console.log('Testing with data:', { testPersonalDetails, testBMIData });

      const result = await BMIService.saveBMIEntry(testPersonalDetails, testBMIData);
      
      if (result) {
        setTestResult(`✅ Test entry saved successfully! ID: ${result.id}`);
        console.log('Test save successful:', result);
      } else {
        setTestResult('❌ Test save returned null');
      }

    } catch (error) {
      console.error('Database test error:', error);
      setTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkEnvironmentVariables = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('Environment variables:');
    console.log('VITE_SUPABASE_URL:', url ? `${url.substring(0, 20)}...` : 'NOT SET');
    console.log('VITE_SUPABASE_ANON_KEY:', key ? `${key.substring(0, 20)}...` : 'NOT SET');
    
    return {
      url: !!url,
      key: !!key,
      configured: isSupabaseConfigured()
    };
  };

  useEffect(() => {
    const envStatus = checkEnvironmentVariables();
    console.log('Environment status:', envStatus);
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Database Test</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Environment Variables:</h4>
          <div className="text-sm text-gray-600">
            <div>URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Not Set'}</div>
            <div>Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not Set'}</div>
            <div>Configured: {isSupabaseConfigured() ? '✅ Yes' : '❌ No'}</div>
          </div>
        </div>

        <button
          onClick={testDatabaseConnection}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Database Connection'}
        </button>

        {testResult && (
          <div className="p-3 bg-gray-100 rounded-lg">
            <p className="text-sm">{testResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseTest;
