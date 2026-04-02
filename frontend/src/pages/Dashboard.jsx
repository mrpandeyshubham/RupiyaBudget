import { useEffect, useState } from 'react';
import api from '../utils/api';
import SummaryCards from '../components/SummaryCards';
import FriendSummaryCard from '../components/FriendSummaryCard';
import DailyExpenseCard from '../components/DailyExpenseCard';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sumRes, dailyRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/analytics/daily')
        ]);
        setSummary(sumRes.data);
        setDailyData(dailyRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-teal-400" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here is your RupiyaBudget overview.</p>
      </div>

      <SummaryCards summary={summary} />
      <FriendSummaryCard friendBalances={summary?.friendBalances} />

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-100">
          <span className="bg-teal-400 w-1.5 h-6 rounded-full inline-block"></span>
          Daily Diary
        </h2>
        
        {/* Timeline Layout */}
        <div className="space-y-6">
          {dailyData.map((day) => (
            <DailyExpenseCard key={day.date} dayData={day} />
          ))}
          {dailyData.length === 0 && (
            <div className="text-center text-slate-500 py-10">
              No transactions recorded yet. Add some to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
