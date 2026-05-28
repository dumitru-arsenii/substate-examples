import { createStore, createSubStore } from "@substate/core";

type LineItem = {
  name: string;
  quantity: number;
  price: number;
};

const invoices = createSubStore({}, (builder) => {
  const setLines = builder.mutation(async (args: { lines: LineItem[] }) => ({
    lines: args.lines,
  }));

  const subtotal = builder
    .withDependencies({ setLines })
    .selector(async ({ setLines }) => ({
      value: setLines.lines.reduce(
        (total, item) => total + item.quantity * item.price,
        0,
      ),
    }));

  const discount = builder
    .withDependencies({ subtotal })
    .selector(async ({ subtotal }) => ({
      value: subtotal.value >= 100 ? subtotal.value * 0.1 : 0,
    }));

  const total = builder
    .withDependencies({ subtotal, discount })
    .selector(async ({ subtotal, discount }) => ({
      value: subtotal.value - discount.value,
    }));

  return { setLines, subtotal, discount, total };
});

const store = createStore({ invoices });
store.setLogLevel("error");

await store.invoices.setLines().run({
  lines: [
    { name: "Design review", quantity: 2, price: 45 },
    { name: "Implementation hour", quantity: 1, price: 80 },
  ],
});

const subtotal = await store.invoices.subtotal().resolve();
const discount = await store.invoices.discount().resolve();
const total = await store.invoices.total().resolve();

console.log("Invoice");
console.log("-------");
console.log(`Subtotal: $${subtotal.value.toFixed(2)}`);
console.log(`Discount: $${discount.value.toFixed(2)}`);
console.log(`Total:    $${total.value.toFixed(2)}`);
