import React from 'react';
import { Wallet, TrendingDown, Layers, Landmark } from 'lucide-react';

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  const cards = [
    { title: 'Remaining Balance', amount: summary.currentRemaining, icon: <Wallet size={24} />, color: 'text-teal-400', bg: 'bg-teal-400/10' },
    { title: 'Total Credit', amount: summary.totalCredit, icon: <Landmark size={24} />, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { title: 'Total Expense', amount: summary.totalExpense, icon: <TrendingDown size={24} />, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { title: 'Udhaar To Receive', amount: summary.udhaarGiven, icon: <Layers size={24} />, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div key={i} className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between items-start space-y-4">
          <div className={`${c.bg} ${c.color} p-3 rounded-xl`}>
            {c.icon}
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">{c.title}</p>
            <p className="text-2xl md:text-3xl font-bold tracking-tight">₹{c.amount?.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
