import { useEffect } from "react";
import type { CartItem } from "./store";
import { useSubstate } from "./store";

const catalog = [
  { id: "starter", name: "Starter kit", price: 29 },
  { id: "team", name: "Team add-on", price: 49 },
  { id: "support", name: "Priority support", price: 19 },
] satisfies Array<Omit<CartItem, "quantity">>;

const initialItems: CartItem[] = [
  { id: "starter", name: "Starter kit", price: 29, quantity: 1 },
];

const currency = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

export function App() {
  const [cart, setItems] = useSubstate((store) => store.cart.setItems());
  const [subtotal, resolveSubtotal] = useSubstate((store) =>
    store.cart.subtotal(),
  );
  const [tax, resolveTax] = useSubstate((store) => store.cart.tax());
  const [total, resolveTotal] = useSubstate((store) => store.cart.total());

  useEffect(() => {
    void updateCart(initialItems);
  }, []);

  async function updateCart(items: CartItem[]) {
    await setItems({ items });
    await resolveSubtotal();
    await resolveTax();
    await resolveTotal();
  }

  async function addItem(item: Omit<CartItem, "quantity">) {
    const items = cart?.items ?? [];
    const existing = items.find((candidate) => candidate.id === item.id);
    const next = existing
      ? items.map((candidate) =>
          candidate.id === item.id
            ? { ...candidate, quantity: candidate.quantity + 1 }
            : candidate,
        )
      : [...items, { ...item, quantity: 1 }];

    await updateCart(next);
  }

  async function removeItem(id: string) {
    const items = cart?.items ?? [];
    const next = items
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
      )
      .filter((item) => item.quantity > 0);

    await updateCart(next);
  }

  return (
    <main className="layout">
      <section className="catalog">
        <p className="eyebrow">Derived cart</p>
        <h1>Source lines in, totals out</h1>
        <div className="products">
          {catalog.map((item) => (
            <button key={item.id} onClick={() => addItem(item)}>
              <span>{item.name}</span>
              <strong>{currency.format(item.price)}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="receipt">
        <h2>Cart</h2>
        <div className="lines">
          {(cart?.items ?? []).map((item) => (
            <div className="line" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <span>
                  {item.quantity} x {currency.format(item.price)}
                </span>
              </div>
              <button onClick={() => removeItem(item.id)}>-</button>
            </div>
          ))}
        </div>
        <dl>
          <div>
            <dt>Subtotal</dt>
            <dd>{currency.format(subtotal?.value ?? 0)}</dd>
          </div>
          <div>
            <dt>Tax</dt>
            <dd>{currency.format(tax?.value ?? 0)}</dd>
          </div>
          <div className="total">
            <dt>Total</dt>
            <dd>{currency.format(total?.value ?? 0)}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}

