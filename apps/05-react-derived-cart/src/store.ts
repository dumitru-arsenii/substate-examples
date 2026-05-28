import { createStore, createSubStore } from "@substate/core";
import { createSubstateReact } from "@substate/react";

export type CartItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

const cart = createSubStore({}, (builder) => {
  const setItems = builder.mutation(async (args: { items: CartItem[] }) => ({
    items: args.items,
  }));

  const subtotal = builder
    .withDependencies({ setItems })
    .selector(async ({ setItems }) => ({
      value: setItems.items.reduce(
        (total, item) => total + item.quantity * item.price,
        0,
      ),
    }));

  const tax = builder
    .withDependencies({ subtotal })
    .selector(async ({ subtotal }) => ({
      value: subtotal.value * 0.0825,
    }));

  const total = builder
    .withDependencies({ subtotal, tax })
    .selector(async ({ subtotal, tax }) => ({
      value: subtotal.value + tax.value,
    }));

  return { setItems, subtotal, tax, total };
});

export const store = createStore({ cart }, {
  cart: {
    setItems: { items: [{ id: "starter", name: "Starter kit", price: 29, quantity: 1 }] },
    subtotal: { value: 12 }
  }
});

export type AppStore = typeof store;

export const { Provider: SubstateProvider, useState: useSubstate } =
  createSubstateReact<AppStore>();
