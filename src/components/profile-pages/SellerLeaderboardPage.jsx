import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function SellerLeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!userId) {
          setError("User ID not found.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .order('rank', { ascending: true });

        if (error) {
          setError(error);
        } else {
          setLeaderboardData(data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [userId]);

  if (loading) {
    return <div className="p-4">Loading leaderboard data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Seller Leaderboard</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Rank</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Seller</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">SKU Count</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Pricing Score</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Sales Volume</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Fulfillment Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leaderboardData.map((seller, index) => (
              <tr 
                key={seller.id} 
                className={`hover:bg-gray-50 transition-colors ${
                  seller.profile_id === userId ? 'bg-green-50' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    index === 0 ? 'bg-green-500 text-white' : 
                    index === 1 ? 'bg-green-400 text-white' : 
                    index === 2 ? 'bg-green-300 text-white' : 
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {index + 1}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{seller.seller_name}</td>
                <td className="px-4 py-3 text-gray-700">{seller.sku_count}</td>
                <td className="px-4 py-3 text-gray-700">{seller.competitive_pricing_score}</td>
                <td className="px-4 py-3 text-gray-700">₹{seller.sales_volume}</td>
                <td className="px-4 py-3 text-gray-700">{seller.order_fulfillment_rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
