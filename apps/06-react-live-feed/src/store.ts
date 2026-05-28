import { createStore, createSubStore } from "@substate/core";
import { createSubstateReact } from "@substate/react";
import { Observable } from "rxjs";

export type FeedEvent = {
  channel: string;
  message: string;
  sequence: number;
  timestamp: string;
};

const messages = [
  "Build finished",
  "Customer upgraded",
  "Webhook received",
  "Cache refreshed",
  "Background job queued",
];

const feeds = createSubStore({}, (builder) => {
  const live = builder.subscription((args: { channel: string }) => {
    return new Observable<FeedEvent>((subscriber) => {
      let sequence = 1;

      const emit = () => {
        const message =
          messages[(sequence - 1) % messages.length] ?? "Feed event received";

        subscriber.next({
          channel: args.channel,
          message,
          sequence,
          timestamp: new Date().toLocaleTimeString(),
        });

        sequence += 1;
      };

      emit();
      const timer = window.setInterval(emit, 1200);

      return () => {
        window.clearInterval(timer);
      };
    });
  });

  return { live };
});

export const store = createStore({ feeds });
store.setLogLevel("error");

export type AppStore = typeof store;

export const { Provider: SubstateProvider, useState: useSubstate } =
  createSubstateReact<AppStore>();
