
import { fetchExchangeRates } from "./api.js";
import {
  addExpense,
  getExpenses,
  removeExpense,
} from "./state.js";
import {
  renderExpenses,
  renderRateStatus,
  renderTotal,
} from "./ui.js";

const form = document.querySelector("#expense-form");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const currencyInput = document.querySelector("#currency-select");
const categoryInput = document.querySelector("#category");
const homeCurrencyInput = document.querySelector("#home-currency");
const categoryFilterInput = document.querySelector("#category-filter");
const formMessage = document.querySelector("#form-message");
const addButton = document.querySelector("#add-button");

let rates = null;
let isLoadingRates = false;

function showFormMessage(message) {
  if (formMessage) {
    formMessage.textContent = message;
  }
}

function renderApp() {
  const expenses = getExpenses();
  const homeCurrency = homeCurrencyInput.value;
  const category = categoryFilterInput.value;

  renderTotal(expenses, homeCurrency, rates);
  renderExpenses(expenses, category, homeCurrency, rates);
}

async function loadRates() {
  if (isLoadingRates) return;

  isLoadingRates = true;
  addButton.disabled = true;
  renderRateStatus("Loading live exchange rates...", "loading");

  try {
    const result = await fetchExchangeRates();
    rates = result.rates;

    renderRateStatus(
      `Exchange rates loaded successfully. Last API update: ${result.updatedAt}`,
      "success"
    );

    showFormMessage("");
    renderApp();
  } catch (error) {
    renderRateStatus(
      `Could not load exchange rates: ${error.message}. Check your connection and retry.`,
      "error"
    );
  } finally {
    isLoadingRates = false;
    addButton.disabled = false;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);
  const currency = currencyInput.value;
  const category = categoryInput.value;

  if (!description) {
    showFormMessage("Please enter an expense description.");
    descriptionInput.focus();
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    showFormMessage("Please enter an amount greater than zero.");
    amountInput.focus();
    return;
  }

  if (!rates) {
    showFormMessage("Exchange rates are not ready yet. Please try again.");
    return;
  }

  if (typeof rates[currency] !== "number") {
    showFormMessage(`Exchange rates for ${currency} are unavailable.`);
    return;
  }

  const expense = {
    id: crypto.randomUUID(),
    description,
    amount,
    currency,
    category,
    createdAt: new Date().toISOString(),
  };

  addExpense(expense);
  form.reset();

  // Restore defaults after resetting the form.
  currencyInput.value = "USD";
  categoryInput.value = "Food";

  showFormMessage("Expense added successfully.");
  renderApp();
});

document.querySelector("#expense-list").addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-id]");

  if (!deleteButton) return;

  removeExpense(deleteButton.dataset.deleteId);
  showFormMessage("Expense deleted.");
  renderApp();
});

homeCurrencyInput.addEventListener("change", () => {
  renderApp();
});

categoryFilterInput.addEventListener("change", () => {
  renderApp();
});

// Fetch rates on startup.
renderApp();
loadRates();
