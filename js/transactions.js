/* Transactions page logic */
let currentFilter = 'all';
let currentSort = 'newest';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  renderTransactions();
  setupFilters();
  setupSearch();
  setupSort();

  // Handle edit from URL
  const params = new URLSearchParams(window.location.search);
  if (params.get('edit')) {
    openEditModal(params.get('edit'));
  }
});

function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTransactions();
    });
  });
}

function setupSearch() {
  const input = document.getElementById('txSearch');
  if (input) {
    input.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderTransactions();
    });
  }
}

function setupSort() {
  const select = document.getElementById('sortSelect');
  if (select) {
    select.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderTransactions();
    });
  }
}

function getFilteredTransactions() {
  let txs = Storage.getTransactions();

  // Filter
  if (currentFilter === 'income') {
    txs = txs.filter(t => t.type === 'income');
  } else if (currentFilter === 'expense') {
    txs = txs.filter(t => t.type === 'expense');
  } else if (currentFilter !== 'all') {
    txs = txs.filter(t => t.category === currentFilter);
  }

  // Search
  if (searchQuery) {
    txs = txs.filter(t =>
      t.description.toLowerCase().includes(searchQuery) ||
      t.category.toLowerCase().includes(searchQuery) ||
      t.amount.toString().includes(searchQuery)
    );
  }

  // Sort
  switch (currentSort) {
    case 'oldest':
      txs.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'highest':
      txs.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
      break;
    case 'lowest':
      txs.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
      break;
    default: // newest
      txs.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return txs;
}

function renderTransactions() {
  const tbody = document.getElementById('txBody');
  if (!tbody) return;
  const txs = getFilteredTransactions();

  document.getElementById('txCount').textContent = txs.length;

  if (txs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <i class="bi bi-inbox"></i>
            <p>No transactions found</p>
          </div>
        </td>
      </tr>`;
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
        </td>
        <td>${App.formatDateShort(tx.date)}</td>
        <td>${tx.description}</td>
        <td><span style="color:${App.getCategoryColor(tx.category)}">${tx.category}</span></td>
        <td><span class="badge-type ${tx.type}">${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</span></td>
        <td class="${isIncome ? 'amount-pos' : 'amount-neg'}">${isIncome ? '+' : '-'}${App.formatCurrency(tx.amount)}</td>
        <td>
          <div class="action-btns">
            <button class="action-btn" onclick="viewTx('${tx.id}')" title="View"><i class="bi bi-eye"></i></button>
            <button class="action-btn" onclick="openEditModal('${tx.id}')" title="Edit"><i class="bi bi-pencil"></i></button>
            <button class="action-btn delete" onclick="deleteTx('${tx.id}')" title="Delete"><i class="bi bi-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function deleteTx(id) {
  if (!App.confirm('Are you sure you want to delete this transaction?')) return;
  Storage.deleteTransaction(id);
  App.showToast('Transaction deleted successfully');
  renderTransactions();
}

function viewTx(id) {
  const tx = Storage.getTransactions().find(t => t.id === id);
  if (!tx) return;
  alert(`Description: ${tx.description}\nAmount: ${App.formatCurrency(tx.amount)}\nCategory: ${tx.category}\nType: ${tx.type}\nDate: ${tx.date}\nPayment: ${tx.payment || 'N/A'}\nNotes: ${tx.notes || 'None'}`);
}

function openEditModal(id) {
  const tx = Storage.getTransactions().find(t => t.id === id);
  if (!tx) return;
  document.getElementById('editId').value = tx.id;
  document.getElementById('editDescription').value = tx.description;
  document.getElementById('editAmount').value = tx.amount;
  document.getElementById('editCategory').value = tx.category;
  document.getElementById('editDate').value = tx.date;
  document.getElementById('editType').value = tx.type;
  document.getElementById('editPayment').value = tx.payment || 'Card';
  document.getElementById('editNotes').value = tx.notes || '';
  const modal = new bootstrap.Modal(document.getElementById('editModal'));
  modal.show();
}

function saveEdit(e) {
  e.preventDefault();
  const id = document.getElementById('editId').value;
  const updates = {
    description: document.getElementById('editDescription').value,
    amount: parseFloat(document.getElementById('editAmount').value),
    category: document.getElementById('editCategory').value,
    date: document.getElementById('editDate').value,
    type: document.getElementById('editType').value,
    payment: document.getElementById('editPayment').value,
    notes: document.getElementById('editNotes').value
  };
  Storage.updateTransaction(id, updates);
  App.showToast('Transaction updated successfully');
  bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
  renderTransactions();
}
