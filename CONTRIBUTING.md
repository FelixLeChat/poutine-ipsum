# Contributing to poutine-ipsum

Thanks for your interest in contributing!

## Getting started

```bash
git clone https://github.com/FelixLeChat/poutine-ipsum.git
cd poutine-ipsum
npm install
```

## Development

- **Run tests:** `npm test`
- **Run linter:** `npm run lint`

A pre-commit hook runs ESLint on staged files automatically.

## Adding words to the dictionaries

The word lists live in `src/dictionaries.js`, split into `classic` (traditional poutine) and `extended` (toppings and variations) for both `en` and `fr`. When adding words:

- Add to both languages when a reasonable translation exists.
- Use spaces for multi-word terms (e.g. `"smoked meat"`, `"foie gras"`).
- Place the word in `classic` if it relates to the base dish, or `extended` if it's a topping or named variation.

## Submitting changes

1. Fork the repo and create a branch from `main`.
2. Make your changes and ensure `npm test` and `npm run lint` pass.
3. Open a pull request with a clear description of what you changed and why.

## Reporting bugs

Use the [bug report template](https://github.com/FelixLeChat/poutine-ipsum/issues/new?template=bug_report.yml) on GitHub Issues.

## Suggesting new features

Use the [feature request template](https://github.com/FelixLeChat/poutine-ipsum/issues/new?template=feature_request.yml) on GitHub Issues.
