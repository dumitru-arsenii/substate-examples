# 01 Node Derived State

Use Substate in a plain Node.js script when you want writes to be explicit and derived reads to declare their dependencies.

```bash
npm run start --workspace apps/01-node-derived-state
```

This example models a small invoice. A mutation sets the invoice lines, and selectors derive subtotal, discount, and final total from that source state.

