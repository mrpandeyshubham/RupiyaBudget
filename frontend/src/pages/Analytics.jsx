import { useEffect, useState } from 'react';
import api from '../utils/api';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const CATEGORY_COLORS = {
  'Food': '#8b5cf6',
  'Education': '#3b82f6',
  'Travel': '#f59e0b',
  'Movie / Entertainment': '#ec4899',
  'Shopping': '#10b981',
  'Bills': '#ef4444',
  'Other': '#64748b'
};

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [sumRes, dailyRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/analytics/daily')
        ]);
        setSummary(sumRes.data);
        
        // Reverse back daily data so oldest is first for the line chart progression
        setDaily([...dailyRes.data].reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-teal-400" size={32} /></div>;

  const categoryData = Object.entries(summary?.categorySpend || {}).map(([name, value]) => ({
    name, value
  })).sort((a, b) => b.value - a.value);

  const trendData = daily.map(d => ({
    dateStr: format(parseISO(d.date), 'dd MMM'),
    expense: d.dailyTotal
  }));

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-white">Spend Analytics</h1>
        <p className="text-slate-400">Deep dive into your kharcha habits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Breakdown */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-6 text-slate-100">Category Breakdown</h3>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categoryData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={100} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS['Other']} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `₹${value}`}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categoryData.map(c => (
               <div key={c.name} className="flex items-center space-x-2 text-sm bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[c.name] || CATEGORY_COLORS['Other'] }} />
                 <span className="text-slate-300">{c.name}</span>
               </div>
            ))}
          </div>
        </div>

        {/* Category Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-6 text-slate-100">Spend by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                  formatter={(value) => `₹${value}`}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS['Other']} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Trend Line */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2">
          <h3 className="text-lg font-bold mb-6 text-slate-100">Daily Spending Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="dateStr" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <Tooltip 
                  formatter={(value) => `₹${value}`}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#2dd4bf" 
                  strokeWidth={3}
                  dot={{ fill: '#0f172a', stroke: '#2dd4bf', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#2dd4bf' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
