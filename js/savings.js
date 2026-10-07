document.addEventListener('DOMContentLoaded', () => {
  renderGoals();
});

function renderGoals() {
  const container = document.getElementById('goalsGrid');
  if (!container) return;
  const goals = Storage.getGoals();

  if (goals.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <i class="bi bi-piggy-bank"></i>
        <p>No savings goals yet. Create your first goal!</p>
        <button class="btn-primary-custom mt-2" onclick="openAddGoal()">Create Goal</button>
      </div>`;
    return;
  }

  container.innerHTML = goals.map(g => {
    const pct = g.target > 0 ? Math.min(100, Math.round((g.saved / g.target) * 100)) : 0;
    const remaining = Math.max(0, g.target - g.saved);
    return `
      <div class="budget-card">
        <div class="header">
          <div class="cat-name">
            <div class="goal-icon" style="width:36px;height:36px;background:${g.color}22;color:${g.color};display:inline-flex;align-items:center;justify-content:center;border-radius:8px;margin-right:0.5rem;">
              <i class="bi ${g.icon}"></i>
            </div>
            ${g.name}
          </div>
          <div class="action-btns">
            <button class="action-btn" onclick="openAddMoney('${g.id}')" title="Add Money"><i class="bi bi-plus-lg"></i></button>
            <button class="action-btn" onclick="editGoal('${g.id}')"><i class="bi bi-pencil"></i></button>
            <button class="action-btn delete" onclick="deleteGoal('${g.id}')"><i class="bi bi-trash"></i></button>
          </div>
        </div>
        <div class="amounts">
          <span class="spent">Saved: ${App.formatCurrency(g.saved)}</span>
          <span class="limit">Goal: ${App.formatCurrency(g.target)}</span>
        </div>
        <div class="progress" style="height:10px;">
          <div class="progress-bar" style="width:${pct}%;background:${g.color}"></div>
        </div>
        <div class="d-flex justify-content-between mt-2" style="font-size:0.8rem;">
          <span style="font-weight:600;color:${g.color}">${pct}%</span>
          <span style="color:var(--text-muted)">${App.formatCurrency(remaining)} remaining</span>
        </div>
      </div>
    `;
  }).join('');
}

function openAddGoal() {
  document.getElementById('goalId').value = '';
  document.getElementById('goalName').value = '';
  document.getElementById('goalTarget').value = '';
  document.getElementById('goalSaved').value = '0';
  document.getElementById('goalIcon').value = 'bi-piggy-bank';
  document.getElementById('goalColor').value = '#10b981';
  document.getElementById('goalModalTitle').textContent = 'Create Savings Goal';
  new bootstrap.Modal(document.getElementById('goalModal')).show();
}

function editGoal(id) {
  const g = Storage.getGoals().find(x => x.id === id);
  if (!g) return;
  document.getElementById('goalId').value = g.id;
  document.getElementById('goalName').value = g.name;
  document.getElementById('goalTarget').value = g.target;
  document.getElementById('goalSaved').value = g.saved;
  document.getElementById('goalIcon').value = g.icon;
  document.getElementById('goalColor').value = g.color;
  document.getElementById('goalModalTitle').textContent = 'Edit Goal';
  new bootstrap.Modal(document.getElementById('goalModal')).show();
}

function saveGoal(e) {
  e.preventDefault();
  const id = document.getElementById('goalId').value;
  const data = {
    name: document.getElementById('goalName').value.trim(),
    target: parseFloat(document.getElementById('goalTarget').value),
    saved: parseFloat(document.getElementById('goalSaved').value) || 0,
    icon: document.getElementById('goalIcon').value,
    color: document.getElementById('goalColor').value
  };
  if (!data.name || !data.target || data.target <= 0) {
    App.showToast('Please fill required fields', 'error');
    return;
  }
  if (id) {
    Storage.updateGoal(id, data);
    App.showToast('Goal updated');
  } else {
    Storage.addGoal(data);
    App.showToast('✓ Goal created');
  }
  bootstrap.Modal.getInstance(document.getElementById('goalModal')).hide();
  renderGoals();
}

function openAddMoney(id) {
  document.getElementById('addMoneyGoalId').value = id;
  document.getElementById('addMoneyAmount').value = '';
  new bootstrap.Modal(document.getElementById('addMoneyModal')).show();
}

function saveAddMoney(e) {
  e.preventDefault();
  const id = document.getElementById('addMoneyGoalId').value;
  const amount = parseFloat(document.getElementById('addMoneyAmount').value);
  if (!amount || amount <= 0) {
    App.showToast('Enter a valid amount', 'error');
    return;
  }
  const g = Storage.getGoals().find(x => x.id === id);
  if (g) {
    Storage.updateGoal(id, { saved: parseFloat(g.saved) + amount });
    App.showToast(`✓ Added ${App.formatCurrency(amount)} to ${g.name}`);
  }
  bootstrap.Modal.getInstance(document.getElementById('addMoneyModal')).hide();
  renderGoals();
}

function deleteGoal(id) {
  if (!App.confirm('Delete this savings goal?')) return;
  Storage.deleteGoal(id);
  App.showToast('Goal deleted');
  renderGoals();
}
