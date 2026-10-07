/* LocalStorage Management for FinancePro */
const Storage = {
  KEYS: {
    TRANSACTIONS: 'fp_transactions',
    BUDGETS: 'fp_budgets',
    GOALS: 'fp_goals',
    SETTINGS: 'fp_settings',
    THEME: 'fp_theme',
    BILLS: 'fp_bills'
  },

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Storage get error:', e);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  },

  // Transactions
  getTransactions() {
    return this.get(this.KEYS.TRANSACTIONS) || [];
  },

  saveTransactions(txs) {
    return this.set(this.KEYS.TRANSACTIONS, txs);
  },

  addTransaction(tx) {
    const txs = this.getTransactions();
    tx.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    txs.unshift(tx);
    this.saveTransactions(txs);
    return tx;
  },

  updateTransaction(id, updates) {
    const txs = this.getTransactions();
    const idx = txs.findIndex(t => t.id === id);
    if (idx !== -1) {
      txs[idx] = { ...txs[idx], ...updates };
      this.saveTransactions(txs);
      return txs[idx];
    }
    return null;
  },

  deleteTransaction(id) {
    let txs = this.getTransactions();
    txs = txs.filter(t => t.id !== id);
    this.saveTransactions(txs);
  },

  // Budgets
  getBudgets() {
    return this.get(this.KEYS.BUDGETS) || [];
  },

  saveBudgets(budgets) {
    return this.set(this.KEYS.BUDGETS, budgets);
  },

  addBudget(budget) {
    const budgets = this.getBudgets();
    budget.id = Date.now().toString();
    budgets.push(budget);
    this.saveBudgets(budgets);
    return budget;
  },

  updateBudget(id, updates) {
    const budgets = this.getBudgets();
    const idx = budgets.findIndex(b => b.id === id);
    if (idx !== -1) {
      budgets[idx] = { ...budgets[idx], ...updates };
      this.saveBudgets(budgets);
      return budgets[idx];
    }
    return null;
  },

  deleteBudget(id) {
    let budgets = this.getBudgets();
    budgets = budgets.filter(b => b.id !== id);
    this.saveBudgets(budgets);
  },

  // Goals
  getGoals() {
    return this.get(this.KEYS.GOALS) || [];
  },

  saveGoals(goals) {
    return this.set(this.KEYS.GOALS, goals);
  },

  addGoal(goal) {
    const goals = this.getGoals();
    goal.id = Date.now().toString();
    goals.push(goal);
    this.saveGoals(goals);
    return goal;
  },

  updateGoal(id, updates) {
    const goals = this.getGoals();
    const idx = goals.findIndex(g => g.id === id);
    if (idx !== -1) {
      goals[idx] = { ...goals[idx], ...updates };
      this.saveGoals(goals);
      return goals[idx];
    }
    return null;
  },

  deleteGoal(id) {
    let goals = this.getGoals();
    goals = goals.filter(g => g.id !== id);
    this.saveGoals(goals);
  },

  // Settings
  getSettings() {
    return this.get(this.KEYS.SETTINGS) || {
      name: 'Natnael Ameha',
      email: 'natnael@example.com',
      currency: 'USD',
      notifications: {
        budgetWarning: true,
        savingsReminder: true,
        monthlyReport: false
      }
    };
  },

  saveSettings(settings) {
    return this.set(this.KEYS.SETTINGS, settings);
  },

  // Theme
  getTheme() {
    return localStorage.getItem(this.KEYS.THEME) || 'light';
  },

  setTheme(theme) {
    localStorage.setItem(this.KEYS.THEME, theme);
  },

  // Bills
  getBills() {
    return this.get(this.KEYS.BILLS) || [];
  },

  saveBills(bills) {
    return this.set(this.KEYS.BILLS, bills);
  },

  // Initialize sample data if empty
  initSampleData() {
    if (this.getTransactions().length === 0) {
      const sampleTxs = [
        { id: '1', date: '2025-04-26', description: 'Salary', category: 'Income', type: 'income', amount: 2500, payment: 'Bank', notes: '' },
        { id: '2', date: '2025-04-24', description: 'Grocery Shopping', category: 'Food', type: 'expense', amount: 45.20, payment: 'Card', notes: '' },
        { id: '3', date: '2025-04-22', description: 'Rent Payment', category: 'Rent', type: 'expense', amount: 600, payment: 'Bank', notes: '' },
        { id: '4', date: '2025-04-20', description: 'Netflix Subscription', category: 'Entertainment', type: 'expense', amount: 15.99, payment: 'Card', notes: '' },
        { id: '5', date: '2025-04-18', description: 'Uber Ride', category: 'Transport', type: 'expense', amount: 12.50, payment: 'Card', notes: '' },
        { id: '6', date: '2025-03-26', description: 'Salary', category: 'Income', type: 'income', amount: 2200, payment: 'Bank', notes: '' },
        { id: '7', date: '2025-03-15', description: 'Restaurant', category: 'Food', type: 'expense', amount: 65, payment: 'Card', notes: '' },
        { id: '8', date: '2025-03-10', description: 'Gas', category: 'Transport', type: 'expense', amount: 40, payment: 'Cash', notes: '' },
        { id: '9', date: '2025-02-26', description: 'Salary', category: 'Income', type: 'income', amount: 2100, payment: 'Bank', notes: '' },
        { id: '10', date: '2025-02-12', description: 'Clothes', category: 'Shopping', type: 'expense', amount: 120, payment: 'Card', notes: '' },
        { id: '11', date: '2025-01-26', description: 'Salary', category: 'Income', type: 'income', amount: 2000, payment: 'Bank', notes: '' },
        { id: '12', date: '2025-01-05', description: 'Internet Bill', category: 'Bills', type: 'expense', amount: 60, payment: 'Bank', notes: '' },
        { id: '13', date: '2024-12-26', description: 'Salary', category: 'Income', type: 'income', amount: 2000, payment: 'Bank', notes: '' },
        { id: '14', date: '2024-12-08', description: 'Holiday Gift', category: 'Shopping', type: 'expense', amount: 85, payment: 'Card', notes: '' },
        { id: '15', date: '2024-11-26', description: 'Salary', category: 'Income', type: 'income', amount: 1900, payment: 'Bank', notes: '' },
        { id: '16', date: '2024-11-15', description: 'Concert Tickets', category: 'Entertainment', type: 'expense', amount: 90, payment: 'Card', notes: '' }
      ];
      this.saveTransactions(sampleTxs);
    }

    if (this.getBudgets().length === 0) {
      const sampleBudgets = [
        { id: 'b1', category: 'Food', limit: 300, icon: 'bi-cup-hot' },
        { id: 'b2', category: 'Rent', limit: 700, icon: 'bi-house' },
        { id: 'b3', category: 'Transport', limit: 200, icon: 'bi-car-front' },
        { id: 'b4', category: 'Entertainment', limit: 100, icon: 'bi-controller' },
        { id: 'b5', category: 'Shopping', limit: 150, icon: 'bi-bag' },
        { id: 'b6', category: 'Bills', limit: 150, icon: 'bi-receipt' }
      ];
      this.saveBudgets(sampleBudgets);
    }

    if (this.getGoals().length === 0) {
      const sampleGoals = [
        { id: 'g1', name: 'Emergency Fund', target: 1000, saved: 200, icon: 'bi-shield-check', color: '#10b981' },
        { id: 'g2', name: 'New Laptop', target: 1200, saved: 300, icon: 'bi-laptop', color: '#3b82f6' },
        { id: 'g3', name: 'Vacation', target: 800, saved: 100, icon: 'bi-airplane', color: '#8b5cf6' }
      ];
      this.saveGoals(sampleGoals);
    }

    if (this.getBills().length === 0) {
      const sampleBills = [
        { id: 'bl1', name: 'Rent', date: '2025-04-28', amount: 600, icon: 'bi-house', color: '#ef4444' },
        { id: 'bl2', name: 'Internet', date: '2025-04-30', amount: 60, icon: 'bi-wifi', color: '#3b82f6' },
        { id: 'bl3', name: 'Netflix', date: '2025-05-03', amount: 15, icon: 'bi-play-btn', color: '#ec4899' }
      ];
      this.saveBills(sampleBills);
    }
  },

  clearAll() {
    Object.values(this.KEYS).forEach(k => localStorage.removeItem(k));
  },

  exportData() {
    return {
      transactions: this.getTransactions(),
      budgets: this.getBudgets(),
      goals: this.getGoals(),
      settings: this.getSettings(),
      bills: this.getBills()
    };
  }
};
