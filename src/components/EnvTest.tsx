import React from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { AlertCircle, CheckCircle, Copy, RefreshCw } from 'lucide-react';

const EnvTest: React.FC = () => {
  const [envVars, setEnvVars] = React.useState({
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  });

  const isConfigured = isSupabaseConfigured();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const refreshEnvVars = () => {
    setEnvVars({
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    });
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-blue-800 font-medium">Environment Variables Test</h3>
        <button
          onClick={refreshEnvVars}
          className="flex items-center px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-blue-800 mb-1">VITE_SUPABASE_URL:</p>
          <div className="bg-white rounded p-2 text-sm font-mono border">
            <div className="flex items-center justify-between">
              <span className={envVars.VITE_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
                {envVars.VITE_SUPABASE_URL || '❌ NOT SET'}
              </span>
              {envVars.VITE_SUPABASE_URL && (
                <button
                  onClick={() => copyToClipboard(envVars.VITE_SUPABASE_URL || '')}
                  className="ml-2 p-1 hover:bg-gray-100 rounded"
                >
                  <Copy className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-blue-800 mb-1">VITE_SUPABASE_ANON_KEY:</p>
          <div className="bg-white rounded p-2 text-sm font-mono border">
            <div className="flex items-center justify-between">
              <span className={envVars.VITE_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
                {envVars.VITE_SUPABASE_ANON_KEY ? 
                  `${envVars.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...` : 
                  '❌ NOT SET'
                }
              </span>
              {envVars.VITE_SUPABASE_ANON_KEY && (
                <button
                  onClick={() => copyToClipboard(envVars.VITE_SUPABASE_ANON_KEY || '')}
                  className="ml-2 p-1 hover:bg-gray-100 rounded"
                >
                  <Copy className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-blue-200">
          <div className="flex items-center">
            {isConfigured ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">✅ Supabase is properly configured!</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800 font-medium">❌ Supabase is not configured</span>
              </>
            )}
          </div>
        </div>

        {!isConfigured && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-sm text-yellow-800">
              <strong>To fix this:</strong> Update your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file with your actual Supabase credentials and restart the dev server.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnvTest;
