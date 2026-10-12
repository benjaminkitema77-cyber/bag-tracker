
import { calculateTotal, convertCurrency, filterExpenses } from "./utils.js";

const currencyLocales = {
  KES: "en-KE",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  INR: "en-IN",
};

export function formatMoney(amount, currency) {
  return new Intl.NumberFormat(currencyLocales[currency] || "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

export function renderTotal(expenses, homeCurrency, rates) {
  const totalElement = document.querySelector("#total-amount");
  const summaryElement = document.querySelector("#summary-note");

  if (!totalElement || !summaryElement) return;

  if (!rates) {
    totalElement.textContent = "Loading...";
    summaryElement.textContent = "Waiting for exchange rates.";
    return;
  }

  const total = calculateTotal(expenses, homeCurrency, rates);

  totalElement.textContent = formatMoney(total, homeCurrency);
  summaryElement.textContent =
    `${expenses.length} expense${expenses.length === 1 ? "" : "s"} recorded. ` +
    `All expenses are converted to ${homeCurrency}.`;
}

export function renderRateStatus(message, status = "info") {
  const statusElement = document.querySelector("#rate-status");

  if (statusElement) {
    statusElement.textContent = message;
    statusElement.dataset.status = status;
  }
}

export function renderExpenses(expenses, category, homeCurrency, rates) {
  const listElement = document.querySelector("#expense-list");

  if (!listElement) return;

  const visibleExpenses = filterExpenses(expenses, category);

  if (visibleExpenses.length === 0) {
    const message =
      expenses.length === 0
        ? "No expenses added yet."
        : "No expenses match this category.";

    listElement.innerHTML = `<p id="empty-state">${message}</p>`;
    return;
  }

  listElement.innerHTML = visibleExpenses
    .map((expense) => {
      const description = escapeHTML(expense.description);
      const expenseCategory = escapeHTML(expense.category);
      const expenseCurrency = escapeHTML(expense.currency);

      let convertedAmount = "Conversion unavailable";

      if (rates) {
        try {
          const converted = convertCurrency(
            expense.amount,
            expense.currency,
            homeCurrency,
            rates
          );

          convertedAmount = formatMoney(converted, homeCurrency);
        } catch {
          convertedAmount = "Conversion unavailable";
        }
      }

      return `
        <article class="expense-card">
          <div>
            <h3>${description}</h3>
            <p>Category: ${expenseCategory}</p>
            <p>Original amount: ${formatMoney(
              expense.amount,
              expenseCurrency
            )}</p>
            <p class="converted-amount">
              Converted amount: ${convertedAmount}
            </p>
          </div>
          <button
            type="button"
            class="delete-button"
            data-delete-id="${escapeHTML(expense.id)}"
            aria-label="Delete ${description}"
          >
            Delete
          </button>
        </article>
      `;
    })
    .join("");
}
