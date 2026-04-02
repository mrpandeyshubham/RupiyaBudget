import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, ArrowRight, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

const typeColors = {
  credit: 'text-amber-400',
  expense: 'text-slate-200'
};

export default function DailyExpenseCard({ dayData }) {
  const dateObj = parseISO(dayData.date);
  
  return (
    <div className="glass-panel rounded-2xl overflow-hidden relative">
      {/* Date Header */}
      <div className="bg-slate-800/60 px-6 py-4 border-b border-slate-700/50 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Calendar size={18} className="text-teal-400" />
          <h3 className="font-bold text-lg">{format(dateObj, 'do MMM yyyy')}</h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Remaining</span>
          <span className="font-bold text-teal-400 text-lg">₹{dayData.remaining.toLocaleString()}</span>
        </div>
      </div>

      {/* Transactions List */}
      <div className="p-6 space-y-4">
        {dayData.transactions.map((t, idx) => (
           <div key={idx} className="flex justify-between items-center group">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className={clsx("font-medium", typeColors[t.type] || 'text-slate-200')}>{t.item}</span>
                  {t.type === 'expense' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                      {t.category}
                    </span>
                  )}
                </div>
                
                {/* Note / friend indicator */}
                {t.type === 'expense' && (t.paidFor !== 'self' || t.paidBy !== 'self') && (
                  <div className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                    <span className="capitalize">{t.paidBy}</span>
                    <ArrowRight size={12} className="mx-1" />
                    <span className="capitalize">{t.paidFor}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={clsx("font-semibold", t.type === 'credit' ? 'text-amber-400' : 'text-slate-200')}>
                  {t.type === 'credit' ? '+' : '-'}₹{t.amount}
                </div>
                {t._id && (
                  <Link to={`/edit/${t._id}`} className="text-slate-500 hover:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 size={16} />
                  </Link>
                )}
              </div>
           </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="px-6 py-3 bg-slate-900/50 border-t border-slate-700/50 flex justify-between text-sm text-slate-400">
        <div className="space-x-4">
          <span>Daily Total: <strong className="text-slate-200">₹{dayData.dailyTotal}</strong></span>
          {(dayData.udhaarGave > 0 || dayData.udhaarTook > 0) && (
            <span className="hidden sm:inline">
              (Udhaar gave: ₹{dayData.udhaarGave} | took: ₹{dayData.udhaarTook})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
