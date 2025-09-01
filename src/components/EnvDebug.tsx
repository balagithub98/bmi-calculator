import React, { useEffect } from 'react';

const EnvDebug: React.FC = () => {
  useEffect(() => {
    // Log environment variables to console
    console.log('=== ENV DEBUG ===');
    console.log('MODE:', import.meta.env.MODE);
    console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    console.log('VITE_SUPABASE_ANON_KEY length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0);
    console.log('DEV:', import.meta.env.DEV);
    console.log('================');
  }, []);

  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔍 Environment Debug (Dev Only)</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium text-yellow-700">MODE:</span>
          <span className="font-mono text-yellow-600">{import.meta.env.MODE}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-yellow-700">VITE_SUPABASE_URL:</span>
          <span className="font-mono text-yellow-600 max-w-xs truncate">
            {import.meta.env.VITE_SUPABASE_URL || 'NOT SET'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-yellow-700">VITE_SUPABASE_ANON_KEY exists:</span>
          <span className="font-mono text-yellow-600">
            {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ true' : '❌ false'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-yellow-700">VITE_SUPABASE_ANON_KEY length:</span>
          <span className="font-mono text-yellow-600">
            {import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-yellow-700">DEV:</span>
          <span className="font-mono text-yellow-600">{import.meta.env.DEV ? '✅ true' : '❌ false'}</span>
        </div>
      </div>
      <p className="text-xs text-yellow-600 mt-2">
        Check browser console for detailed logs. This component only shows in development mode.
      </p>
    </div>
  );
};

export default EnvDebug;
