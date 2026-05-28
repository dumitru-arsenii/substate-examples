import { createCascadeStore, createCascadeSubStore } from "@substate/core";

type Task = {
  id: number;
  title: string;
  done: boolean;
};

const tasks = createCascadeSubStore({}, (builder) => {
  const seed = builder.mutation(async (args: { tasks: Task[] }) => ({
    tasks: args.tasks,
  }));

  const add = builder
    .withDependencies({ seed })
    .mutation(async (args: { title: string }, { seed }) => ({
      tasks: [
        ...seed.tasks,
        {
          id: seed.tasks.length + 1,
          title: args.title,
          done: false,
        },
      ],
    }));

  const complete = builder
    .withDependencies({ seed })
    .mutation(async (args: { id: number }, { seed }) => ({
      tasks: seed.tasks.map((task) =>
        task.id === args.id ? { ...task, done: true } : task,
      ),
    }));

  const activeTasks = builder
    .withDependencies({ seed })
    .selector(async ({ seed }) => ({
      tasks: seed.tasks.filter((task) => !task.done),
    }));

  const summary = builder
    .withDependencies({ seed })
    .selector(async ({ seed }) => ({
      total: seed.tasks.length,
      done: seed.tasks.filter((task) => task.done).length,
      open: seed.tasks.filter((task) => !task.done).length,
    }));

  return { seed, add, complete, activeTasks, summary };
});

const store = createCascadeStore({ tasks });
store.setLogLevel("error");

const [command = "list", ...args] = process.argv.slice(2);

await store.tasks.seed().run({
  tasks: [
    { id: 1, title: "Write examples plan", done: true },
    { id: 2, title: "Review Substate API", done: false },
  ],
});

if (command === "add") {
  const title = args.join(" ").trim();

  if (!title) {
    throw new Error('Usage: npm run start --workspace apps/02-cli-task-runner -- add "Ship docs"');
  }

  const result = await store.tasks.add().run({ title });
  await store.tasks.seed().run(result);
}

if (command === "complete") {
  const id = Number(args[0]);

  if (!Number.isInteger(id)) {
    throw new Error("Usage: npm run start --workspace apps/02-cli-task-runner -- complete 1");
  }

  const result = await store.tasks.complete().run({ id });
  await store.tasks.seed().run(result);
}

const activeTasks = await store.tasks.activeTasks().resolve();
const summary = await store.tasks.summary().resolve();

console.log("Tasks");
console.log("-----");
for (const task of activeTasks.tasks) {
  console.log(`${task.id}. ${task.title}`);
}
console.log("");
console.log(`Open: ${summary.open} | Done: ${summary.done} | Total: ${summary.total}`);
