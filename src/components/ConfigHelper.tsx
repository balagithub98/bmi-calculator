import React from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { AlertCircle, CheckCircle, Copy } from 'lucide-react';

const ConfigHelper: React.FC = () => {
  const isConfigured = isSupabaseConfigured();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isConfigured) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <p className="text-green-800">Supabase is properly configured! 🎉</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-yellow-800 font-medium mb-2">Supabase Configuration Required</h3>
          <p className="text-yellow-700 text-sm mb-3">
            To use the full features of this BMI calculator, you need to configure Supabase.
          </p>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">1. Get your Supabase credentials:</p>
              <ul className="text-sm text-yellow-700 ml-4 space-y-1">
                <li>• Go to your Supabase project dashboard</li>
                <li>• Navigate to Settings → API</li>
                <li>• Copy the Project URL and anon/public key</li>
              </ul>
            </div>
            
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">2. Update your .env.local file:</p>
              <div className="bg-gray-100 rounded p-2 text-sm font-mono">
                <div className="flex items-center justify-between">
                  <span>VITE_SUPABASE_URL=your_project_url_here</span>
                  <button
                    onClick={() => copyToClipboard('VITE_SUPABASE_URL=your_project_url_here')}
                    className="ml-2 p-1 hover:bg-gray-200 rounded"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>VITE_SUPABASE_ANON_KEY=your_anon_key_here</span>
                  <button
                    onClick={() => copyToClipboard('VITE_SUPABASE_ANON_KEY=your_anon_key_here')}
                    className="ml-2 p-1 hover:bg-gray-200 rounded"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">3. Restart the development server:</p>
              <div className="bg-gray-100 rounded p-2 text-sm font-mono">
                <div className="flex items-center justify-between">
                  <span>npm run dev</span>
                  <button
                    onClick={() => copyToClipboard('npm run dev')}
                    className="ml-2 p-1 hover:bg-gray-200 rounded"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-yellow-600 mt-3">
            <strong>Note:</strong> The app will work without Supabase, but authentication and data persistence will be disabled.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfigHelper;
