import React from 'react';
import BMICalculator from './components/BMICalculator';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <BMICalculator />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;