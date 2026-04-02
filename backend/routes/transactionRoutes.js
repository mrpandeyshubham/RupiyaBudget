const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { categorizeItem } = require('../utils/categorize');

// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    const { date, type, item, amount, category, paidFor, paidBy, note } = req.body;

    let finalCategory = category;
    if (type === 'expense' && (!category || category === 'Other')) {
        finalCategory = categorizeItem(item);
    } else if (type === 'credit') {
        finalCategory = 'Credit';
    }

    const t = new Transaction({
      date: new Date(date),
      type,
      item,
      amount: Number(amount),
      category: finalCategory,
      paidFor: paidFor || 'self',
      paidBy: paidBy || 'self',
      note
    });

    await t.save();
    res.status(201).json(t);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1, createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/transactions/:id
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Not found' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/transactions/:id
router.put('/:id', async (req, res) => {
  try {
    const { date, type, item, amount, category, paidFor, paidBy, note } = req.body;
    let finalCategory = category;
    if (type === 'expense' && (!category || category === 'Other')) {
        finalCategory = categorizeItem(item);
    } else if (type === 'credit') {
        finalCategory = 'Credit';
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        date: new Date(date),
        type,
        item,
        amount: Number(amount),
        category: finalCategory,
        paidFor: paidFor || 'self',
        paidBy: paidBy || 'self',
        note
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
