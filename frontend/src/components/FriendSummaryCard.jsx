import React from 'react';
import { Users } from 'lucide-react';

export default function FriendSummaryCard({ friendBalances, udhaarGiven, udhaarTaken }) {
  if (!friendBalances) return null;

  const friends = Object.keys(friendBalances).filter(f => f !== 'self' && friendBalances[f] !== 0);

  if (friends.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-indigo-500/20 text-indigo-400 p-2 rounded-lg">
          <Users size={20} />
        </div>
        <h3 className="text-lg font-bold">Friend & Udhaar Adjustments</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {friends.map(f => {
          const bal = friendBalances[f];
          const isOweMe = bal > 0;
          return (
            <div key={f} className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl flex justify-between items-center">
              <span className="font-medium capitalize text-slate-200">{f}</span>
              <div className="text-right">
                <span className={`text-sm block ${isOweMe ? 'text-teal-400' : 'text-rose-400'}`}>
                  {isOweMe ? 'se lena hai' : 'ko dena hai'}
                </span>
                <span className={`font-bold text-lg ${isOweMe ? 'text-teal-400' : 'text-rose-400'}`}>
                  ₹{Math.abs(bal)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
