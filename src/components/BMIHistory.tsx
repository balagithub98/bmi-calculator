import React, { useState, useEffect } from 'react';
import { BMIService, BMIEntry } from '../services/bmiService';
import { Trash2, Calendar, User, Scale, TrendingUp, AlertCircle } from 'lucide-react';

const BMIHistory: React.FC = () => {
  const [entries, setEntries] = useState<BMIEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await BMIService.getBMIHistory();
      setEntries(data);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      await BMIService.deleteBMIEntry(entryId);
      setEntries(entries.filter(entry => entry.id !== entryId));
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to delete entry');
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-600', bg: 'bg-green-50' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { category: 'Obese', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 mb-4">
          <TrendingUp className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No BMI history yet</h3>
        <p className="text-gray-500">Start by calculating your BMI to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">BMI History</h2>
        <span className="text-sm text-gray-500">{entries.length} entries</span>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => {
          const bmiInfo = getBMICategory(entry.bmi);
          return (
            <div
              key={entry.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>{entry.full_name}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(entry.created_at)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Age:</span>
                      <span className="ml-1 font-medium">{entry.age}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Gender:</span>
                      <span className="ml-1 font-medium capitalize">{entry.gender}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Height:</span>
                      <span className="ml-1 font-medium">{entry.height_cm} cm</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Weight:</span>
                      <span className="ml-1 font-medium">{entry.weight_kg} kg</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <Scale className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-lg">{entry.bmi.toFixed(1)}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bmiInfo.bg} ${bmiInfo.color}`}>
                      {bmiInfo.category}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {entry.unit_system} units
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(entry.id)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BMIHistory;
