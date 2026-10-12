
import { describe, expect, it } from "vitest";
import {
  calculateTotal,
  convertCurrency,
  filterExpenses,
  updateExpense,
} from "../src/utils.js";

const rates = {
  USD: 1,
  KES: 130,
  EUR: 0.92,
  GBP: 0.78,
  INR: 83,
};

const expenses = [
  {
    id: "1",
    description: "Lunch",
    amount: 10,
    currency: "USD",
    category: "Food",
  },
  {
    id: "2",
    description: "Bus fare",
    amount: 260,
    currency: "KES",
    category: "Transport",
  },
];

describe("convertCurrency", () => {
  it("converts USD to KES", () => {
    expect(convertCurrency(10, "USD", "KES", rates)).toBe(1300);
  });

  it("converts KES to USD", () => {
    expect(convertCurrency(130, "KES", "USD", rates)).toBe(1);
  });

  it("returns the same value when currencies match", () => {
    expect(convertCurrency(25, "USD", "USD", rates)).toBe(25);
  });

  it("rejects invalid amounts", () => {
    expect(() =>
      convertCurrency("invalid", "USD", "KES", rates)
    ).toThrow("Amount must be a valid number.");
  });

  it("rejects unavailable currency rates", () => {
    expect(() =>
      convertCurrency(10, "USD", "XYZ", rates)
    ).toThrow("Exchange rates are unavailable");
  });
});

describe("calculateTotal", () => {
  it("calculates the total in the selected home currency", () => {
    expect(calculateTotal(expenses, "USD", rates)).toBe(12);
    expect(calculateTotal(expenses, "KES", rates)).toBe(1560);
  });

  it("returns zero for an empty expense list", () => {
    expect(calculateTotal([], "KES", rates)).toBe(0);
  });
});

describe("filterExpenses", () => {
  it("filters by category", () => {
    expect(filterExpenses(expenses, "Food")).toHaveLength(1);
    expect(filterExpenses(expenses, "Food")[0].description).toBe("Lunch");
  });

  it("returns all expenses when category is All", () => {
    expect(filterExpenses(expenses, "All")).toHaveLength(2);
  });

  it("does not mutate the original array", () => {
    const result = filterExpenses(expenses, "All");

    expect(result).not.toBe(expenses);
    expect(expenses).toHaveLength(2);
  });
});

describe("updateExpense", () => {
  it("updates an expense without mutating the original", () => {
    const updated = updateExpense(expenses, "1", {
      description: "Dinner",
    });

    expect(updated[0].description).toBe("Dinner");
    expect(expenses[0].description).toBe("Lunch");
    expect(updated).not.toBe(expenses);
  });

  it("leaves other expenses unchanged", () => {
    const updated = updateExpense(expenses, "1", {
      description: "Dinner",
    });

    expect(updated[1]).toEqual(expenses[1]);
  });
});
