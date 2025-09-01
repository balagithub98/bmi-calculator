import React from 'react';
import BMICalculator from './components/BMICalculator';
import ConfigHelper from './components/ConfigHelper';
import EnvTest from './components/EnvTest';
import SimpleTest from './components/SimpleTest';
import SupabaseConnectionTest from './components/SupabaseConnectionTest';
import EnvDebug from './components/EnvDebug';
import DatabaseTest from './components/DatabaseTest';
import ErrorBoundary from './components/ErrorBoundary';

// Debug component to show environment variables
const DebugEnv: React.FC = () => {
  return (
    <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', borderRadius: '5px', fontFamily: 'monospace', fontSize: '12px' }}>
      <h3>Debug Environment Variables:</h3>
      <p>VITE_SUPABASE_URL: "{import.meta.env.VITE_SUPABASE_URL}"</p>
      <p>VITE_SUPABASE_ANON_KEY: "{import.meta.env.VITE_SUPABASE_ANON_KEY ? import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 50) + '...' : 'NOT SET'}"</p>
      <p>URL Length: {import.meta.env.VITE_SUPABASE_URL?.length || 0}</p>
      <p>Key Length: {import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0}</p>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <EnvDebug />
          <DebugEnv />
          <SimpleTest />
          <SupabaseConnectionTest />
          <EnvTest />
          <ConfigHelper />
          <DatabaseTest />
          <BMICalculator />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;