import { useEffect, useState } from "react";
import { useSubstate } from "./store";

const channels = ["deployments", "billing", "support"];

export function App() {
  const [channel, setChannel] = useState(channels[0]!);
  const [event, watchFeed, status] = useSubstate((store) =>
    store.feeds.live(),
  );

  useEffect(() => {
    void watchFeed({ channel });
  }, [channel, watchFeed]);

  return (
    <main className="screen">
      <section className="feed">
        <p className="eyebrow">Live feed</p>
        <h1>Observable state in React</h1>
        <div className="tabs">
          {channels.map((name) => (
            <button
              className={name === channel ? "active" : ""}
              key={name}
              onClick={() => setChannel(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="event">
          <span>#{event?.sequence ?? 0}</span>
          <strong>{event?.message ?? "Waiting for feed..."}</strong>
          <small>
            {event?.channel ?? channel} {event?.timestamp ?? ""}
          </small>
        </div>

        <p className="status">
          Ready: {String(status.ready)} | Fetching first event:{" "}
          {String(status.fetching)}
        </p>
      </section>
    </main>
  );
}

