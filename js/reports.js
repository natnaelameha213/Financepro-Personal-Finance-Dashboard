document.addEventListener('DOMContentLoaded', () => {
  renderSummary();
  renderIncomeExpenseBar();
  renderCategoryDoughnut();
  renderSavingsProgress();
});

function renderSummary() {
  const now = new Date();
  const current = App.getTotals(now.getMonth(), now.getFullYear());
  const map = App.getExpensesByCategory(now.getMonth(), now.getFullYear());
  let highestCat = 'N/A', highestAmt = 0;
  Object.entries(map).forEach(([k, v]) => { if (v > highestAmt) { highestAmt = v; highestCat = k; } });
  const savingsRate = current.income > 0 ? Math.round((current.balance / current.income) * 100) : 0;
  const monthly = App.getMonthlyData();
  const avgSpending = monthly.expenseData.reduce((a, b) => a + b, 0) / (monthly.expenseData.length || 1);

  document.getElementById('repIncome').textContent = App.formatCurrency(current.income);
  document.getElementById('repExpenses').textContent = App.formatCurrency(current.expenses);
  document.getElementById('repBalance').textContent = App.formatCurrency(current.balance);
  document.getElementById('repAvg').textContent = App.formatCurrency(avgSpending);
  document.getElementById('repHighest').textContent = `${highestCat} (${App.formatCurrency(highestAmt)})`;
  document.getElementById('repRate').textContent = savingsRate + '%';
}

function renderIncomeExpenseBar() {
  const ctx = document.getElementById('reportIEChart');
  if (!ctx) return;
  const data = App.getMonthlyData();
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.months,
      datasets: [
        { label: 'Income', data: data.incomeData, backgroundColor: '#10b981', borderRadius: 6 },
        { label: 'Expenses', data: data.expenseData, backgroundColor: '#3b82f6', borderRadius: 6 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94a3b8' } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8', callback: v => '$' + v } }
      }
    }
  });
}

function renderCategoryDoughnut() {
  const ctx = document.getElementById('reportCatChart');
  if (!ctx) return;
  const now = new Date();
  const map = App.getExpensesByCategory(now.getMonth(), now.getFullYear());
  const labels = Object.keys(map);
  const values = Object.values(map);
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data: values, backgroundColor: labels.map(l => App.getCategoryColor(l)), borderWidth: 0 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: { legend: { position: 'right', labels: { color: '#94a3b8', padding: 12 } } }
    }
  });
}

function renderSavingsProgress() {
  const ctx = document.getElementById('reportSavingsChart');
  if (!ctx) return;
  const goals = Storage.getGoals();
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: goals.map(g => g.name),
      datasets: [{
        label: 'Progress %',
        data: goals.map(g => g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0),
        backgroundColor: goals.map(g => g.color),
        borderRadius: 6,
        barThickness: 30
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { max: 100, grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8', callback: v => v + '%' } },
        y: { grid: { display: false }, ticks: { color: '#94a3b8' } }
      }
    }
  });
}
