/* FinancePro - Core App Functions */
const App = {
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  },

  formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  formatDateShort(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  getCategoryIcon(category) {
    const icons = {
      'Food': 'bi-cup-hot',
      'Rent': 'bi-house',
      'Transport': 'bi-car-front',
      'Entertainment': 'bi-controller',
      'Shopping': 'bi-bag',
      'Bills': 'bi-receipt',
      'Health': 'bi-heart-pulse',
      'Education': 'bi-book',
      'Other': 'bi-three-dots',
      'Income': 'bi-wallet2',
      'Freelance': 'bi-laptop',
      'Salary': 'bi-cash-stack'
    };
    return icons[category] || 'bi-circle';
  },

  getCategoryColor(category) {
    const colors = {
      'Food': '#f59e0b',
      'Rent': '#ec4899',
      'Transport': '#06b6d4',
      'Entertainment': '#8b5cf6',
      'Shopping': '#3b82f6',
      'Bills': '#ef4444',
      'Health': '#10b981',
      'Education': '#6366f1',
      'Other': '#64748b',
      'Income': '#10b981'
    };
    return colors[category] || '#64748b';
  },

  // Calculate totals
  getTotals(month = null, year = null) {
    const txs = Storage.getTransactions();
    let filtered = txs;
    if (month !== null && year !== null) {
      filtered = txs.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === month && d.getFullYear() === year;
      });
    }
    const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + parseFloat(t.amount), 0);
    const expenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + parseFloat(t.amount), 0);
    const savings = Storage.getGoals().reduce((s, g) => s + parseFloat(g.saved), 0);
    return {
      income,
      expenses,
      balance: income - expenses,
      savings
    };
  },

  getPreviousMonthTotals() {
    const now = new Date();
    let m = now.getMonth() - 1;
    let y = now.getFullYear();
    if (m < 0) { m = 11; y--; }
    return this.getTotals(m, y);
  },

  getPercentChange(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  },

  // Category spending
  getExpensesByCategory(month = null, year = null) {
    const txs = Storage.getTransactions().filter(t => t.type === 'expense');
    let filtered = txs;
    if (month !== null && year !== null) {
      filtered = txs.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === month && d.getFullYear() === year;
      });
    }
    const map = {};
    filtered.forEach(t => {
      map[t.category] = (map[t.category] || 0) + parseFloat(t.amount);
    });
    return map;
  },

  // Monthly data for charts (last 6 months)
  getMonthlyData() {
    const months = [];
    const incomeData = [];
    const expenseData = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      const label = d.toLocaleDateString('en-US', { month: 'short' });
      months.push(label);
      const totals = this.getTotals(m, y);
      incomeData.push(totals.income);
      expenseData.push(totals.expenses);
    }
    return { months, incomeData, expenseData };
  },

  // Budget spent
  getBudgetSpent(category) {
    const now = new Date();
    const map = this.getExpensesByCategory(now.getMonth(), now.getFullYear());
    return map[category] || 0;
  },

  // Toast notification
  showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container') || this.createToastContainer();
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type === 'error' ? 'error' : ''}`;
    toast.innerHTML = `
      <i class="bi ${type === 'error' ? 'bi-x-circle' : 'bi-check-circle'} text-${type === 'error' ? 'danger' : 'success'}"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  createToastContainer() {
    const c = document.createElement('div');
    c.className = 'toast-container';
    document.body.appendChild(c);
    return c;
  },

  // Theme
  initTheme() {
    const theme = Storage.getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.checked = theme === 'light';
      toggle.addEventListener('change', () => {
        const newTheme = toggle.checked ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        Storage.setTheme(newTheme);
      });
    }
  },

  // Mobile sidebar
  initSidebar() {
    const btn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (btn && sidebar) {
      btn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('open');
      });
      if (overlay) {
        overlay.addEventListener('click', () => {
          sidebar.classList.remove('open');
          overlay.classList.remove('open');
        });
      }
    }
  },

  // Confirm dialog
  confirm(message) {
    return window.confirm(message);
  },

  // Get path prefix based on current location
  getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) return '../';
    return './';
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  Storage.initSampleData();
  App.initTheme();
  App.initSidebar();
});
