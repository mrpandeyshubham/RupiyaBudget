import { useEffect, useState } from 'react';
import api from '../utils/api';
import { format, parseISO } from 'date-fns';
import { Loader2, Search, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AllTransactions() {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchTxs() {
      try {
        const res = await api.get('/transactions');
        setTxs(res.data);
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTxs();
  }, []);

  const filtered = txs.filter(t => 
    t.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-teal-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">All Transactions</h1>
          <p className="text-slate-400">View and search your full history.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search item or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-64"
          />
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/60 text-slate-300 text-sm tracking-wider uppercase">
              <th className="p-4 rounded-tl-xl">Date</th>
              <th className="p-4">Item</th>
              <th className="p-4">Category</th>
              <th className="p-4">Paid By → For</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Type</th>
              <th className="p-4 rounded-tr-xl">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filtered.map(t => (
              <tr key={t._id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 text-slate-300 w-32 shrink-0">{format(parseISO(t.date), 'dd MMM yy')}</td>
                <td className="p-4 font-medium text-white">{t.item}</td>
                <td className="p-4">
                  <span className="text-xs px-2 py-1 rounded-md bg-slate-700 text-slate-300">{t.category}</span>
                </td>
                <td className="p-4 text-sm text-slate-400 capitalize">
                  {t.paidBy} <span className="text-slate-500">→</span> {t.paidFor}
                </td>
                <td className={`p-4 font-bold ${t.type === 'credit' ? 'text-amber-400' : 'text-slate-200'}`}>
                  ₹{t.amount}
                </td>
                <td className="p-4 text-sm">
                  {t.type === 'credit' ? (
                    <span className="text-amber-400 bg-amber-400/10 px-2 py-1 rounded">Credit</span>
                  ) : (
                    <span className="text-rose-400 bg-rose-400/10 px-2 py-1 rounded">Expense</span>
                  )}
                </td>
                <td className="p-4">
                  <Link to={`/edit/${t._id}`} className="text-slate-400 hover:text-teal-400 transition-colors">
                    <Edit2 size={18} />
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-500">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
