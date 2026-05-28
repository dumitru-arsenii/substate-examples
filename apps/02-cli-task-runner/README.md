# 02 CLI Task Runner

Use Substate in a CLI when command handlers should mutate source state and summaries should be derived from that state.

```bash
npm run start --workspace apps/02-cli-task-runner -- add "Ship docs"
npm run start --workspace apps/02-cli-task-runner -- complete 1
npm run start --workspace apps/02-cli-task-runner -- list
```

This example keeps data in memory so the store flow stays easy to read.

