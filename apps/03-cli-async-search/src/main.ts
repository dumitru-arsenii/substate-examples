import { createStore, createSubStore } from "@substate/core";

type SearchHit = {
  title: string;
  category: string;
};

const catalog: SearchHit[] = [
  { title: "React provider bindings", category: "react" },
  { title: "Node derived state", category: "node" },
  { title: "CLI async workflows", category: "cli" },
  { title: "Live feed subscriptions", category: "streaming" },
];

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const search = createSubStore({}, (builder) => {
  const runSearch = builder.mutation(async (args: { query: string }) => {
    await wait(250);

    if (args.query.toLowerCase() === "fail") {
      throw new Error("The search service returned a simulated error.");
    }

    return {
      query: args.query,
      hits: catalog.filter((item) =>
        `${item.title} ${item.category}`
          .toLowerCase()
          .includes(args.query.toLowerCase()),
      ),
    };
  });

  const summary = builder
    .withDependencies({ runSearch })
    .selector(async ({ runSearch }) => ({
      label:
        runSearch.hits.length === 1
          ? "1 result"
          : `${runSearch.hits.length} results`,
    }));

  return { runSearch, summary };
});

const store = createStore({ search });

const query = process.argv.slice(2).join(" ").trim() || "substate";
const flow = store.search.runSearch();

console.log(`Searching for "${query}"...`);

try {
  const result = await flow.run({ query });
  const summary = store.search.summary().value();

  console.log(summary.label);
  for (const hit of result.hits) {
    console.log(`- ${hit.title} (${hit.category})`);
  }

  console.log("");
  console.log("Latest result snapshot:");
  console.log(JSON.stringify(flow.latest(), null, 2));
} catch (error) {
  const latest = flow.latest();

  console.error(error instanceof Error ? error.message : String(error));
  console.error("Latest result snapshot:");
  console.error(JSON.stringify(latest, null, 2));
  process.exitCode = 1;
}
