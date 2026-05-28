import { createStore, createSubStore } from "@substate/core";
import { createSubstateReact } from "@substate/react";

const counter = createSubStore({}, (builder) => {
  const setCount = builder.mutation(async (args: { value: number }) => ({
    value: args.value,
  }));

  const doubled = builder
    .withDependencies({ setCount })
    .selector(async ({ setCount }) => ({
      value: setCount.value * 2,
    }));

  return { setCount, doubled };
});

export const store = createStore({ counter });
store.setLogLevel("error");

export type AppStore = typeof store;

export const { Provider: SubstateProvider, useState: useSubstate } =
  createSubstateReact<AppStore>();
