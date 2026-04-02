import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, Tag, CreditCard, UserPlus, StickyNote, Activity, Trash2 } from 'lucide-react';
import api from '../utils/api';

export default function EditTransaction() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    type: 'expense',
    date: new Date().toISOString().substring(0, 10),
    item: '',
    amount: '',
    paidFor: 'self',
    paidBy: 'self',
    note: ''
  });

  useEffect(() => {
    async function fetchTx() {
      try {
        const res = await api.get(`/transactions/${id}`);
        const tx = res.data;
        setFormData({
          type: tx.type || 'expense',
          date: new Date(tx.date).toISOString().substring(0, 10),
          item: tx.item || '',
          amount: tx.amount || '',
          paidFor: tx.paidFor || 'self',
          paidBy: tx.paidBy || 'self',
          note: tx.note || ''
        });
      } catch (err) {
        console.error(err);
        alert('Failed to load transaction data.');
        navigate('/');
      } finally {
        setFetching(false);
      }
    }
    fetchTx();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/transactions/${id}`, formData);
      navigate('/transactions');
    } catch (err) {
      console.error(err);
      alert('Failed to update transaction.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    setLoading(true);
    try {
      await api.delete(`/transactions/${id}`);
      navigate('/transactions');
    } catch (err) {
      console.error(err);
      alert('Failed to delete transaction.');
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-20 text-teal-400"><Activity className="animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Kharcha</h1>
        <button 
           onClick={handleDelete}
           className="text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-4 py-2 rounded-xl flex items-center gap-2 transition"
        >
          <Trash2 size={18} /> Delete
        </button>
      </div>
      
      <div className="glass-panel p-6 md:p-8 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Type Toggle */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl">
            <button
              type="button"
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${formData.type === 'expense' ? 'bg-rose-500/20 text-rose-400 shadow' : 'text-slate-400 hover:text-slate-200'}`}
              onClick={() => setFormData({ ...formData, type: 'expense' })}
            >
              Expense
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${formData.type === 'credit' ? 'bg-amber-500/20 text-amber-400 shadow' : 'text-slate-400 hover:text-slate-200'}`}
              onClick={() => setFormData({ ...formData, type: 'credit' })}
            >
              Credit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Amount */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <CreditCard size={16} className="text-teal-400" /> Amount (₹)
              </label>
              <input
                required
                type="number"
                name="amount"
                min="0"
                step="0.01"
                placeholder="e.g. 150"
                value={formData.amount}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
            </div>

            {/* Item Name */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Tag size={16} className="text-teal-400" /> Item / Title
              </label>
              <input
                required
                type="text"
                name="item"
                placeholder="e.g. Egg Curry Rice"
                value={formData.item}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Clock size={16} className="text-teal-400" /> Date
              </label>
              <input
                required
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
            </div>

            {/* Paid By */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <UserPlus size={16} className="text-teal-400" /> Paid By
              </label>
              <input
                type="text"
                name="paidBy"
                placeholder="e.g. self or friend's name"
                value={formData.paidBy}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
            </div>

            {/* Paid For */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <UserPlus size={16} className="text-teal-400" /> Paid For
              </label>
              <input
                type="text"
                name="paidFor"
                placeholder="e.g. self or friend's name"
                value={formData.paidFor}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
            </div>

            {/* Note */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <StickyNote size={16} className="text-teal-400" /> Optional Note
              </label>
              <input
                type="text"
                name="note"
                placeholder="Any details..."
                value={formData.note}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-white font-bold py-4 rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-500 flex justify-center items-center"
          >
            {loading ? <Activity className="animate-spin" /> : 'Update Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}
