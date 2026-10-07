/* Dashboard specific logic */
document.addEventListener('DOMContentLoaded', () => {
  renderKPIs();
  renderIncomeExpenseChart();
  renderCategoryChart();
  renderRecentTransactions();
  renderSavingsGoals();
  renderUpcomingBills();
  renderMonthlySpending();
  renderFinancialSummary();
});

function renderKPIs() {
  const now = new Date();
  const current = App.getTotals(now.getMonth(), now.getFullYear());
  const prev = App.getPreviousMonthTotals();

  const incomeChange = App.getPercentChange(current.income, prev.income);
  const expenseChange = App.getPercentChange(current.expenses, prev.expenses);
  const balanceChange = App.getPercentChange(current.balance, prev.balance);
  const savingsChange = 25; // sample

  document.getElementById('kpiIncome').textContent = App.formatCurrency(current.income);
  document.getElementById('kpiExpenses').textContent = App.formatCurrency(current.expenses);
  document.getElementById('kpiBalance').textContent = App.formatCurrency(current.balance);
  document.getElementById('kpiSavings').textContent = App.formatCurrency(current.savings);

  setChange('incomeChange', incomeChange);
  setChange('expenseChange', expenseChange);
  setChange('balanceChange', balanceChange);
  setChange('savingsChange', savingsChange);
}

function setChange(id, pct) {
  const el = document.getElementById(id);
  if (!el) return;
  const up = pct >= 0;
  el.className = `change ${up ? 'up' : 'down'}`;
  el.innerHTML = `<i class="bi bi-arrow-${up ? 'up' : 'down'}"></i> ${Math.abs(pct)}% from last month`;
}

let incomeExpenseChart = null;
function renderIncomeExpenseChart() {
  const ctx = document.getElementById('incomeExpenseChart');
  if (!ctx) return;
  const data = App.getMonthlyData();
  if (incomeExpenseChart) incomeExpenseChart.destroy();
  incomeExpenseChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.months,
      datasets: [
        {
          label: 'Income',
          data: data.incomeData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#10b981'
        },
        {
          label: 'Expenses',
          data: data.expenseData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#3b82f6'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: '#94a3b8', usePointStyle: true, pointStyle: 'circle', padding: 20 }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(148,163,184,0.1)' },
          ticks: { color: '#94a3b8' }
        },
        y: {
          grid: { color: 'rgba(148,163,184,0.1)' },
          ticks: {
            color: '#94a3b8',
            callback: v => '$' + (v >= 1000 ? (v/1000) + 'k' : v)
          }
        }
      }
    }
  });
}

let categoryChart = null;
function renderCategoryChart() {
  const ctx = document.getElementById('categoryChart');
  if (!ctx) return;
  const now = new Date();
  const map = App.getExpensesByCategory(now.getMonth(), now.getFullYear());
  const labels = Object.keys(map);
  const values = Object.values(map);
  const total = values.reduce((a, b) => a + b, 0);
  const colors = labels.map(l => App.getCategoryColor(l));

  if (categoryChart) categoryChart.destroy();
  categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const pct = total ? Math.round((ctx.raw / total) * 100) : 0;
              return ` ${ctx.label}: ${App.formatCurrency(ctx.raw)} (${pct}%)`;
            }
          }
        }
      }
    }
  });

  // Center text
  const centerEl = document.getElementById('categoryTotal');
  if (centerEl) centerEl.textContent = App.formatCurrency(total);

  // Legend
  const legendEl = document.getElementById('categoryLegend');
  if (legendEl) {
    legendEl.innerHTML = labels.map((l, i) => {
      const pct = total ? Math.round((values[i] / total) * 100) : 0;
      return `<li><span><span class="dot" style="background:${colors[i]}"></span>${l}</span><span>${pct}%</span></li>`;
    }).join('');
  }
}

function renderRecentTransactions() {
  const tbody = document.getElementById('recentTxBody');
  if (!tbody) return;
  const txs = Storage.getTransactions().slice(0, 5);
  if (txs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No transactions yet</td></tr>';
    return;
  }
  tbody.innerHTML = txs.map(tx => {
    const isIncome = tx.type === 'income';
    return `
      <tr>
        <td>
          <span class="tx-icon ${isIncome ? 'income' : 'expense'}">
            <i class="bi ${App.getCategoryIcon(tx.category)}"></i>
          </span>
          ${App.formatDateShort(tx.date)}
        </td>
        <td>${tx.description}</td>
        <td><span class="cat-${tx.category.toLowerCase()}">${tx.category}</span></td>
        <td><span class="badge-type ${tx.type}">${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</span></td>
        <td class="${isIncome ? 'amount-pos' : 'amount-neg'}">${isIncome ? '+' : '-'}${App.formatCurrency(tx.amount)}</td>
        <td>
          <div class="action-btns">
            <button class="action-btn" onclick="editTx('${tx.id}')" title="Edit"><i class="bi bi-pencil"></i></button>
            <button class="action-btn delete" onclick="deleteTx('${tx.id}')" title="Delete"><i class="bi bi-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderSavingsGoals() {
  const container = document.getElementById('goalsList');
  if (!container) return;
  const goals = Storage.getGoals();
  if (goals.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="bi bi-piggy-bank"></i><p>No savings goals yet</p></div>';
    return;
  }
  container.innerHTML = goals.map(g => {
    const pct = g.target > 0 ? Math.min(100, Math.round((g.saved / g.target) * 100)) : 0;
    return `
      <div class="goal-item">
        <div class="goal-icon" style="background:${g.color}22;color:${g.color}">
          <i class="bi ${g.icon}"></i>
        </div>
        <div class="goal-info">
          <div class="name">${g.name}</div>
          <div class="amounts">${App.formatCurrency(g.saved)} / ${App.formatCurrency(g.target)}</div>
          <div class="progress"><div class="progress-bar" style="width:${pct}%;background:${g.color}"></div></div>
        </div>
        <div class="goal-pct">${pct}%</div>
      </div>
    `;
  }).join('');
}

function renderUpcomingBills() {
  const container = document.getElementById('billsList');
  if (!container) return;
  const bills = Storage.getBills();
  if (bills.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No upcoming bills</p></div>';
    return;
  }
  container.innerHTML = bills.map(b => `
    <div class="bill-item">
      <div class="bill-icon" style="background:${b.color}22;color:${b.color}">
        <i class="bi ${b.icon}"></i>
      </div>
      <div class="bill-info">
        <div class="name">${b.name}</div>
        <div class="date">${App.formatDateShort(b.date)}</div>
      </div>
      <div class="bill-amount">-${App.formatCurrency(b.amount)}</div>
    </div>
  `).join('');
}

let monthlyChart = null;
function renderMonthlySpending() {
  const ctx = document.getElementById('monthlySpendingChart');
  if (!ctx) return;
  const now = new Date();
  const map = App.getExpensesByCategory(now.getMonth(), now.getFullYear());
  const labels = Object.keys(map);
  const values = Object.values(map);
  const colors = labels.map(l => App.getCategoryColor(l));

  if (monthlyChart) monthlyChart.destroy();
  monthlyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderRadius: 6,
        barThickness: 28
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8', font: { size: 11 } }
        },
        y: {
          grid: { color: 'rgba(148,163,184,0.1)' },
          ticks: {
            color: '#94a3b8',
            callback: v => '$' + v
          }
        }
      }
    }
  });
}

function renderFinancialSummary() {
  const now = new Date();
  const current = App.getTotals(now.getMonth(), now.getFullYear());
  const map = App.getExpensesByCategory(now.getMonth(), now.getFullYear());
  let highestCat = 'N/A';
  let highestAmt = 0;
  Object.entries(map).forEach(([k, v]) => {
    if (v > highestAmt) { highestAmt = v; highestCat = k; }
  });
  const savingsRate = current.income > 0 ? Math.round((current.balance / current.income) * 100) : 0;

  // Average monthly spending (last 6 months)
  const monthly = App.getMonthlyData();
  const avgSpending = monthly.expenseData.reduce((a, b) => a + b, 0) / (monthly.expenseData.length || 1);

  const el = document.getElementById('financialSummary');
  if (!el) return;
  el.innerHTML = `
    <li><span class="label">Total Income</span><span class="value">${App.formatCurrency(current.income)}</span></li>
    <li><span class="label">Total Expenses</span><span class="value">${App.formatCurrency(current.expenses)}</span></li>
    <li><span class="label">Average Monthly Spending</span><span class="value">${App.formatCurrency(avgSpending)}</span></li>
    <li><span class="label">Highest Category</span><span class="value">${highestCat} (${Math.round((highestAmt/(current.expenses||1))*100)}%)</span></li>
    <li><span class="label">Savings Rate</span><span class="value">${savingsRate}%</span></li>
  `;
}

function deleteTx(id) {
  if (!App.confirm('Delete this transaction?')) return;
  Storage.deleteTransaction(id);
  App.showToast('Transaction deleted');
  renderKPIs();
  renderRecentTransactions();
  renderIncomeExpenseChart();
  renderCategoryChart();
  renderMonthlySpending();
  renderFinancialSummary();
}

function editTx(id) {
  // Redirect to transactions page with edit - for simplicity show alert
  window.location.href = 'pages/transactions.html?edit=' + id;
}
