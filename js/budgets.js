document.addEventListener('DOMContentLoaded', () => {
  renderBudgets();
});

function renderBudgets() {
  const container = document.getElementById('budgetGrid');
  if (!container) return;
  const budgets = Storage.getBudgets();

  if (budgets.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <i class="bi bi-pie-chart"></i>
        <p>No budgets set yet</p>
        <button class="btn-primary-custom mt-2" onclick="openAddBudget()">Create Budget</button>
      </div>`;
    return;
  }

  container.innerHTML = budgets.map(b => {
    const spent = App.getBudgetSpent(b.category);
    const pct = b.limit > 0 ? Math.min(100, Math.round((spent / b.limit) * 100)) : 0;
    const exceeded = spent > b.limit;
    const barColor = exceeded ? '#ef4444' : pct > 80 ? '#f59e0b' : '#10b981';
    return `
      <div class="budget-card">
        <div class="header">
          <div class="cat-name">
            <i class="bi ${b.icon || App.getCategoryIcon(b.category)}" style="color:${App.getCategoryColor(b.category)}"></i>
            ${b.category}
          </div>
          <div class="action-btns">
            <button class="action-btn" onclick="editBudget('${b.id}')"><i class="bi bi-pencil"></i></button>
            <button class="action-btn delete" onclick="deleteBudget('${b.id}')"><i class="bi bi-trash"></i></button>
          </div>
        </div>
        <div class="amounts">
          <span class="spent">Spent: ${App.formatCurrency(spent)}</span>
          <span class="limit">Budget: ${App.formatCurrency(b.limit)}</span>
        </div>
        <div class="progress" style="height:8px;">
          <div class="progress-bar" style="width:${pct}%;background:${barColor}"></div>
        </div>
        <div class="d-flex justify-content-between mt-1" style="font-size:0.75rem;color:var(--text-muted)">
          <span>${pct}%</span>
          <span>${App.formatCurrency(Math.max(0, b.limit - spent))} left</span>
        </div>
        ${exceeded ? '<div class="warning"><i class="bi bi-exclamation-triangle"></i> Budget limit exceeded!</div>' : ''}
      </div>
    `;
  }).join('');
}

function openAddBudget() {
  document.getElementById('budgetId').value = '';
  document.getElementById('budgetCategory').value = 'Food';
  document.getElementById('budgetLimit').value = '';
  document.getElementById('budgetModalTitle').textContent = 'Add Budget';
  new bootstrap.Modal(document.getElementById('budgetModal')).show();
}

function editBudget(id) {
  const b = Storage.getBudgets().find(x => x.id === id);
  if (!b) return;
  document.getElementById('budgetId').value = b.id;
  document.getElementById('budgetCategory').value = b.category;
  document.getElementById('budgetLimit').value = b.limit;
  document.getElementById('budgetModalTitle').textContent = 'Edit Budget';
  new bootstrap.Modal(document.getElementById('budgetModal')).show();
}

function saveBudget(e) {
  e.preventDefault();
  const id = document.getElementById('budgetId').value;
  const category = document.getElementById('budgetCategory').value;
  const limit = parseFloat(document.getElementById('budgetLimit').value);
  if (!limit || limit <= 0) {
    App.showToast('Please enter a valid limit', 'error');
    return;
  }
  if (id) {
    Storage.updateBudget(id, { category, limit });
    App.showToast('Budget updated');
  } else {
    // Check if category already exists
    const exists = Storage.getBudgets().find(b => b.category === category);
    if (exists) {
      App.showToast('Budget for this category already exists', 'error');
      return;
    }
    Storage.addBudget({ category, limit, icon: App.getCategoryIcon(category) });
    App.showToast('Budget created');
  }
  bootstrap.Modal.getInstance(document.getElementById('budgetModal')).hide();
  renderBudgets();
}

function deleteBudget(id) {
  if (!App.confirm('Delete this budget?')) return;
  Storage.deleteBudget(id);
  App.showToast('Budget deleted');
  renderBudgets();
}
