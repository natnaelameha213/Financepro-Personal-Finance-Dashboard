# FinancePro — Personal Finance Dashboard

A professional, frontend-only personal finance dashboard built with HTML5, CSS3, Bootstrap 5, JavaScript (ES6+), Chart.js, and LocalStorage.

## Features

- **Dashboard** with KPI cards, Income vs Expenses line chart, Expenses by Category doughnut chart, Recent Transactions, Savings Goals, Upcoming Bills, Monthly Spending bar chart, Financial Summary
- **Transactions** — full CRUD, search, filter by type/category, sort by date/amount
- **Add Income / Add Expense** — dedicated forms with validation
- **Budgets** — set monthly limits per category, progress bars, over-budget warnings
- **Savings Goals** — create goals, track progress, add money
- **Reports** — Income vs Expenses bar, Category breakdown, Savings progress, key metrics
- **Settings** — profile, currency, dark/light mode, notifications, export/clear/reset data
- **Dark / Light Mode** — preference saved in LocalStorage
- **Responsive** — works on desktop, tablet, and mobile (offcanvas sidebar)

## Tech Stack

| Technology     | Purpose                    |
|----------------|----------------------------|
| HTML5          | Structure                  |
| CSS3           | Custom dark SaaS theme     |
| Bootstrap 5    | Layout & components        |
| Bootstrap Icons| Icons                      |
| JavaScript ES6+| Logic & interactions       |
| Chart.js       | Data visualization         |
| LocalStorage   | Data persistence           |

## Project Structure

```
personal-finance-dashboard/
├── index.html              # Dashboard
├── pages/
│   ├── transactions.html
│   ├── add-income.html
│   ├── add-expense.html
│   ├── budgets.html
│   ├── savings.html
│   ├── reports.html
│   └── settings.html
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   ├── storage.js          # LocalStorage CRUD
│   ├── app.js              # Shared utilities
│   ├── dashboard.js
│   ├── transactions.js
│   ├── budgets.js
│   ├── savings.js
│   └── reports.js
└── README.md
```

## How to Run

1. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
2. No build step or server required — pure frontend.
3. Sample data loads automatically on first visit.

## Portfolio Skills Demonstrated

- Dashboard UI / UX design
- Data visualization with Chart.js
- CRUD operations
- Client-side state management (LocalStorage)
- Search, filter, sort
- Form validation
- Toast notifications & modals
- Dark/Light theme switching
- Fully responsive layout
- Clean modular JavaScript architecture

## Author

Built as a portfolio project to showcase modern frontend skills beyond traditional PHP/MySQL apps.
