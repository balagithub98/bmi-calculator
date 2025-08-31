import React from 'react';
import BMICalculator from './components/BMICalculator';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <BMICalculator />
      </div>
    </ErrorBoundary>
  );
}

export default App;