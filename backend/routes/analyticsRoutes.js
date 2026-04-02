const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { parseISO, format, isValid } = require('date-fns');

router.get('/summary', async (req, res) => {
  try {
    const txs = await Transaction.find();
    
    let totalCredit = 0;
    let totalExpense = 0;
    let udhaarGiven = 0; // I paid for someone else
    let udhaarTaken = 0; // Someone else paid for me
    let friendBalances = {}; // positive means friend owes me, negative means I owe friend

    const categorySpend = {};

    txs.forEach(t => {
      if (t.type === 'credit') {
        totalCredit += t.amount;
      } else {
        totalExpense += t.amount;
        
        // Categoy spend (only considering what I consumed, not what I paid for others?)
        // Let's keep it simple: any expense goes to category spend
        if (t.category !== 'Credit') {
          categorySpend[t.category] = (categorySpend[t.category] || 0) + t.amount;
        }

        // Udhaar logic
        const lowerPaidFor = t.paidFor ? t.paidFor.toLowerCase() : 'self';
        const lowerPaidBy = t.paidBy ? t.paidBy.toLowerCase() : 'self';

        if (lowerPaidBy === 'self' && lowerPaidFor !== 'self') {
          // I paid for someone
          udhaarGiven += t.amount;
          friendBalances[lowerPaidFor] = (friendBalances[lowerPaidFor] || 0) + t.amount;
        } else if (lowerPaidBy !== 'self' && lowerPaidFor === 'self') {
          // Someone paid for me
          udhaarTaken += t.amount;
          friendBalances[lowerPaidBy] = (friendBalances[lowerPaidBy] || 0) - t.amount;
        }
      }
    });

    const currentRemaining = totalCredit - totalExpense + udhaarTaken; 
    // Wait, if I spend 130 on egg curry (self paid), totalExpense=130. Rem=2500-130=2370.
    // If I spend 130 for Uma (self paid), totalExpense increases by 130. Rem=2370-130=2240.
    // If Uma pays 20 for me, totalExpense increases by 20. But my cash didn't decrease! So remaining + udhaarTaken.

    res.json({
      totalCredit,
      totalExpense,
      currentRemaining,
      categorySpend,
      udhaarGiven,
      udhaarTaken,
      friendBalances
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/daily', async (req, res) => {
  try {
    const txs = await Transaction.find().sort({ date: 1, createdAt: 1 });
    
    // Group by date string (YYYY-MM-DD)
    const grouped = {};
    const groupsArray = [];
    
    let runningBalance = 0;

    txs.forEach(t => {
      const d = new Date(t.date);
      if(!isValid(d)) return;
      const dateStr = format(d, 'yyyy-MM-dd');
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = {
          date: dateStr,
          transactions: [],
          dailyTotal: 0,
          udhaarGave: 0,
          udhaarTook: 0,
          remaining: 0
        };
        groupsArray.push(grouped[dateStr]);
      }

      const g = grouped[dateStr];
      g.transactions.push(t);

      if (t.type === 'credit') {
        runningBalance += t.amount;
      } else {
        const lowerPaidFor = t.paidFor ? t.paidFor.toLowerCase() : 'self';
        const lowerPaidBy = t.paidBy ? t.paidBy.toLowerCase() : 'self';

        if (lowerPaidBy === 'self') {
          // My cash went out
          runningBalance -= t.amount;
          g.dailyTotal += t.amount; 
          
          if (lowerPaidFor !== 'self') {
            g.udhaarGave += t.amount;
          }
        } else {
          // Someone else's cash went out
          if (lowerPaidFor === 'self') {
            // They paid for me
            g.udhaarTook += t.amount;
            g.dailyTotal += t.amount; // Still counts as my expense overall
          }
        }
      }
      
      g.remaining = runningBalance;
    });

    // reverse to show newest first
    res.json(groupsArray.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
