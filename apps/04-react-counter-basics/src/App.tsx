import { useEffect } from "react";
import { useSubstate } from "./store";

export function App() {
  const [count, setCount, countStatus] = useSubstate((store) =>
    store.counter.setCount(),
  );
  const [doubled, resolveDoubled, doubledStatus] = useSubstate((store) =>
    store.counter.doubled(),
  );

  useEffect(() => {
    void setCount({ value: 1 }).then(() => resolveDoubled());
  }, [resolveDoubled, setCount]);

  const value = count?.value ?? 0;

  async function update(nextValue: number) {
    await setCount({ value: nextValue });
    await resolveDoubled();
  }

  return (
    <main className="shell">
      <section className="panel">
        <p className="eyebrow">React basics</p>
        <h1>Typed flows in a component</h1>
        <div className="metric">
          <span>Count</span>
          <strong>{value}</strong>
        </div>
        <div className="metric">
          <span>Doubled selector</span>
          <strong>{doubled?.value ?? 0}</strong>
        </div>
        <div className="actions">
          <button onClick={() => update(value - 1)}>-</button>
          <button onClick={() => update(value + 1)}>+</button>
        </div>
        <p className="status">
          Mutation ready: {String(countStatus.ready)} | Selector fetching:{" "}
          {String(doubledStatus.fetching)}
        </p>
      </section>
    </main>
  );
}

