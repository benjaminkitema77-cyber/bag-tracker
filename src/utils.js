
export function convertCurrency(amount, fromCurrency, toCurrency, rates) {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    throw new Error("Amount must be a valid number.");
  }

  if (
    !rates ||
    typeof rates[fromCurrency] !== "number" ||
    typeof rates[toCurrency] !== "number" ||
    rates[fromCurrency] <= 0 ||
    rates[toCurrency] <= 0
  ) {
    throw new Error("Exchange rates are unavailable for that currency.");
  }

  // The rates are USD-based, so convert through USD.
  return (value / rates[fromCurrency]) * rates[toCurrency];
}

export function calculateTotal(expenses, homeCurrency, rates) {
  return expenses.reduce((total, expense) => {
    return (
      total +
      convertCurrency(
        expense.amount,
        expense.currency,
        homeCurrency,
        rates
      )
    );
  }, 0);
}

export function filterExpenses(expenses, category) {
  if (category === "All") {
    return [...expenses];
  }

  return expenses.filter((expense) => expense.category === category);
}

export function updateExpense(expenses, id, changes) {
  return expenses.map((expense) =>
    expense.id === id ? { ...expense, ...changes } : expense
  );
}
