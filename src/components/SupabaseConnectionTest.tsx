import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { BMIService } from '../services/bmiService';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Database, 
  RefreshCw,
  Play,
  Square
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

const SupabaseConnectionTest: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    clearResults();

    // Test 1: Environment Variables
    addResult({
      name: 'Environment Variables',
      status: 'pending',
      message: 'Checking environment variables...'
    });

    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      addResult({
        name: 'Environment Variables',
        status: 'error',
        message: 'Environment variables are missing',
        details: `URL: ${url ? 'Present' : 'Missing'}, Key: ${key ? 'Present' : 'Missing'}`
      });
      setIsRunning(false);
      return;
    }

    addResult({
      name: 'Environment Variables',
      status: 'success',
      message: 'Environment variables are properly configured',
      details: `URL: ${url.substring(0, 30)}..., Key: ${key.substring(0, 20)}...`
    });

    // Test 2: Supabase Client Creation
    addResult({
      name: 'Supabase Client',
      status: 'pending',
      message: 'Testing Supabase client creation...'
    });

    try {
      if (!supabase) {
        throw new Error('Supabase client is null');
      }
      addResult({
        name: 'Supabase Client',
        status: 'success',
        message: 'Supabase client created successfully'
      });
    } catch (error) {
      addResult({
        name: 'Supabase Client',
        status: 'error',
        message: 'Failed to create Supabase client',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      setIsRunning(false);
      return;
    }

    // Test 3: Database Connection
    addResult({
      name: 'Database Connection',
      status: 'pending',
      message: 'Testing database connection...'
    });

    try {
      const { data, error } = await supabase
        .from('bmi_entries')
        .select('count')
        .limit(1);

      if (error) {
        if (error.code === 'PGRST116') {
          addResult({
            name: 'Database Connection',
            status: 'warning',
            message: 'Connected to Supabase but table does not exist',
            details: 'Please run the SQL schema to create the bmi_entries table'
          });
        } else {
          addResult({
            name: 'Database Connection',
            status: 'error',
            message: 'Database connection failed',
            details: `${error.code}: ${error.message}`
          });
        }
      } else {
        addResult({
          name: 'Database Connection',
          status: 'success',
          message: 'Database connection successful',
          details: `Table bmi_entries is accessible. Count: ${data?.[0]?.count || 'N/A'}`
        });
      }
    } catch (error) {
      addResult({
        name: 'Database Connection',
        status: 'error',
        message: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 4: Anonymous Access
    addResult({
      name: 'Anonymous Access',
      status: 'pending',
      message: 'Testing anonymous access...'
    });

    try {
      // Test if we can access the database without authentication
      const { error } = await supabase
        .from('bmi_entries')
        .select('count')
        .limit(1);

      if (error) {
        addResult({
          name: 'Anonymous Access',
          status: 'error',
          message: 'Anonymous access failed',
          details: error.message
        });
      } else {
        addResult({
          name: 'Anonymous Access',
          status: 'success',
          message: 'Anonymous access is working',
          details: 'Can access database without authentication'
        });
      }
    } catch (error) {
      addResult({
        name: 'Anonymous Access',
        status: 'error',
        message: 'Anonymous access failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 5: Data Insertion
    addResult({
      name: 'Data Insertion',
      status: 'pending',
      message: 'Testing data insertion...'
    });

    try {
      // Test if we can insert data without authentication
      const testData = {
        user_id: 'test_session_' + Date.now(),
        full_name: 'Test User',
        email: 'test@example.com',
        age: 25,
        gender: 'other',
        height_cm: 170.0,
        weight_kg: 70.0,
        unit_system: 'metric',
        bmi: 24.22
      };

      const { error } = await supabase
        .from('bmi_entries')
        .insert(testData);

      if (error) {
        addResult({
          name: 'Data Insertion',
          status: 'error',
          message: 'Data insertion failed',
          details: error.message
        });
      } else {
        addResult({
          name: 'Data Insertion',
          status: 'success',
          message: 'Data insertion is working',
          details: 'Can insert data without authentication'
        });
      }
    } catch (error) {
      addResult({
        name: 'Data Insertion',
        status: 'error',
        message: 'Data insertion failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 6: BMI Service
    addResult({
      name: 'BMI Service',
      status: 'pending',
      message: 'Testing BMI service...'
    });

    try {
      const history = await BMIService.getBMIHistory();
      addResult({
        name: 'BMI Service',
        status: 'success',
        message: 'BMI service is working',
        details: `Retrieved ${history.length} entries`
      });
    } catch (error) {
      addResult({
        name: 'BMI Service',
        status: 'error',
        message: 'BMI service failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Database className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Supabase Connection Test</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={clearResults}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Clear
          </button>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-1"
          >
            {isRunning ? (
              <>
                <Square className="w-4 h-4" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run All Tests</span>
              </>
            )}
          </button>
        </div>
      </div>

      {results.length === 0 && !isRunning && (
        <div className="text-center py-8 text-gray-500">
          <Database className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Click "Run All Tests" to test your Supabase connection</p>
        </div>
      )}

      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
          >
            <div className="flex items-start space-x-3">
              {getStatusIcon(result.status)}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{result.name}</h3>
                <p className="text-sm text-gray-700 mt-1">{result.message}</p>
                {result.details && (
                  <p className="text-xs text-gray-600 mt-1 font-mono bg-white px-2 py-1 rounded">
                    {result.details}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {results.length > 0 && !isRunning && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Tests completed: {results.length}
            </span>
            <div className="flex space-x-4 text-xs">
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>{results.filter(r => r.status === 'success').length} Passed</span>
              </span>
              <span className="flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-yellow-600" />
                <span>{results.filter(r => r.status === 'warning').length} Warnings</span>
              </span>
              <span className="flex items-center space-x-1">
                <XCircle className="w-3 h-3 text-red-600" />
                <span>{results.filter(r => r.status === 'error').length} Failed</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseConnectionTest;
