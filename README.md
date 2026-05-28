# Substate Examples

Focused examples for when to use [`@substate/core`](https://www.npmjs.com/package/@substate/core) and [`@substate/react`](https://www.npmjs.com/package/@substate/react).

This repository is intentionally split across Node.js scripts, CLI programs, and React apps so Substate does not look like a React-only state library.

## Install

```bash
npm install
```

## When To Use Each Example

| Example | Runtime | Use Substate when... | Run |
| --- | --- | --- | --- |
| `01-node-derived-state` | Node.js | plain scripts need explicit mutations and dependency-driven derived reads | `npm run start --workspace apps/01-node-derived-state` |
| `02-cli-task-runner` | Node.js CLI | command results should update summaries without manually synchronizing totals | `npm run start --workspace apps/02-cli-task-runner -- add "Ship docs"` |
| `03-cli-async-search` | Node.js CLI | async command results need typed loading/error/latest state | `npm run start --workspace apps/03-cli-async-search -- react` |
| `04-react-counter-basics` | React | a component should read and run typed store flows through a provider | `npm run dev --workspace apps/04-react-counter-basics` |
| `05-react-derived-cart` | React | UI totals should be derived from source cart state | `npm run dev --workspace apps/05-react-derived-cart` |
| `06-react-live-feed` | React | observable streams should become app state | `npm run dev --workspace apps/06-react-live-feed` |

## Verify Everything

```bash
npm run typecheck
npm run build
```

## Notes

- Node and CLI examples use `@substate/core` directly.
- React examples add `@substate/react`, `react`, and `react-dom`.
- The live feed example uses `rxjs` to model an external stream.

