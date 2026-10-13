
# Sewesyder Expense Tracker

A responsive expense tracker that records expenses in different currencies and `converts them into a selected home currency using live exchange rates`.

## Features

- Add expenses with descriptions, amounts, currencies, and categories.
- Display each expense in its original currency and converted home currency.
- Calculate a running total.
- Delete expenses.
- Filter expenses by category.
- Select a home currency.
- Fetch live exchange rates from the ExchangeRate-API endpoint.
- Display loading and error messages.
- Responsive layout for mobile and desktop.
- Automated unit tests and ESLint checks.

## Technologies

- HTML
- CSS
- JavaScript ES modules
- Fetch API and async/await
- ExchangeRate-API
- Vite
- Vitest
- ESLint
- GitHub Pages

## Run locally

1. Install Node.js (a current supported LTS release is recommended).
2. Clone the repository:

      bash
   git clone https://github.com/benjaminkitema77-cyber/expense-tracker.git
   cd expense-tracker
   

3. Install dependencies:

      bash
   npm install
   

4. Start the development server:

      bash
   npm run dev
   

5. Open the local URL printed in your terminal.

## Tests and linting

Run the tests:

  bash
npm test


Run ESLint:

  bash
npm run lint


Build the production site:

   bash
npm run build


Preview the production build:

   bash
npm run preview


## Exchange rates

The application retrieves rates from:

https://open.er-api.com/v6/latest/USD

The API uses USD as its base currency. The application converts an expense into the home currency using the source and destination rates.

An internet connection is required to retrieve current exchange rates.

## Deployment

The project can be deployed to GitHub Pages. Configure the repository's Pages settings and deployment workflow, then publish the built site.

Live demo: https://benjaminkitema77-cyber.github.io/bag-tracker/

## Current limitations

- Expenses are stored in memory and reset when the page reloads.
- Exchange-rate updates depend on the availability of the external API.
- The application does not currently support accounts or cloud synchronization.

## Future improvements

- Save expenses in localStorage.
- Add charts and monthly summaries.
- Support editing existing expenses.
- Add CSV export.
- Add automated browser-level tests.
