import React from 'react';

const SimpleTest: React.FC = () => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h3 className="text-green-800 font-medium mb-2">✅ App is Loading!</h3>
      <p className="text-green-700 text-sm">
        If you can see this message, the React app is working correctly.
      </p>
      <p className="text-green-700 text-sm mt-1">
        Current time: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
};

export default SimpleTest;
