
let expenses = [];

export function getExpenses() {
  return [...expenses];
}

export function addExpense(expense) {
  expenses = [...expenses, expense];
  return getExpenses();
}

export function removeExpense(id) {
  expenses = expenses.filter((expense) => expense.id !== id);
  return getExpenses();
}

export function updateExpenseById(id, changes) {
  expenses = expenses.map((expense) =>
    expense.id === id ? { ...expense, ...changes } : expense
  );

  return getExpenses();
}

export function clearExpenses() {
  expenses = [];
}
