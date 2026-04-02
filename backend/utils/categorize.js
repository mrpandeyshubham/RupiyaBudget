const categories = {
  'Food': ['biryani', 'rice', 'egg', 'maggie', 'maggi', 'banana', 'panipuri', 'chai', 'samosa', 'momo', 'burger', 'pizza', 'lunch', 'dinner'],
  'Education': ['xerox', 'print', 'notebook', 'pen', 'book', 'copy', 'college', 'assignment', 'lab'],
  'Travel': ['auto', 'rapido', 'ola', 'uber', 'bus', 'train', 'petrol', 'rickshaw'],
  'Movie / Entertainment': ['movie', 'cinema', 'ticket', 'theatre', 'netflix'],
  'Shopping': ['amazon', 'flipkart', 'clothes', 'shoes', 'accessories'],
  'Bills': ['recharge', 'jio', 'airtel', 'wifi', 'electricity', 'bill'],
};

const categorizeItem = (itemName) => {
  if (!itemName) return 'Other';
  const nameLower = itemName.toLowerCase();

  for (const [category, keywords] of Object.entries(categories)) {
    for (const keyword of keywords) {
      if (nameLower.includes(keyword)) {
        return category;
      }
    }
  }
  
  return 'Other';
};

module.exports = { categorizeItem };
