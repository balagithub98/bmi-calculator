import React, { useState, useEffect, useCallback } from 'react';
import { UserService } from '../services/userService';
import { UserRecord } from '../lib/supabase';
import { Calendar, TrendingUp, User, Mail } from 'lucide-react';

interface UserHistoryProps {
  userEmail: string;
  onSelectRecord: (record: UserRecord) => void;
}

const UserHistory: React.FC<UserHistoryProps> = ({ userEmail, onSelectRecord }) => {
  const [records, setRecords] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserRecords();
  }, [userEmail, loadUserRecords]);

  const loadUserRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userRecords = await UserService.getUserRecords(userEmail);
      setRecords(userRecords);
    } catch (err) {
      setError('Failed to load your history');
      console.error('Error loading user records:', err);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Underweight':
        return 'text-blue-600 bg-blue-100';
      case 'Normal weight':
        return 'text-green-600 bg-green-100';
      case 'Overweight':
        return 'text-orange-600 bg-orange-100';
      case 'Obese':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading your history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={loadUserRecords}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No History Yet</h3>
          <p className="text-gray-600">Your BMI calculations will appear here once you complete your first calculation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your BMI History</h2>
        <p className="text-gray-600">Previous calculations and trends</p>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={record.id}
            onClick={() => onSelectRecord(record)}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{record.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    {record.email}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{record.bmi.toFixed(1)}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(record.bmi_category)}`}>
                  {record.bmi_category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">
                  {record.height} {record.height_unit}
                </div>
                <div className="text-sm text-gray-600">Height</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">
                  {record.weight} {record.weight_unit}
                </div>
                <div className="text-sm text-gray-600">Weight</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(record.created_at)}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Age: {record.age}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400 capitalize">{record.gender}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHistory;
