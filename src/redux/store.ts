import { configureStore } from "@reduxjs/toolkit";
import { ticketReducer } from "./manageTicket";
import { cpTicketReducer } from "./comparisonTicket";
import { packageTicketReducer } from "./packageTicket";
import { ticketEventReducer } from "./manageTicket/manageEventTicket";

export const store = configureStore({
  reducer: {
    ticket: ticketReducer,
    cpTicket: cpTicketReducer,
    packageTicket: packageTicketReducer,
    ticketEvent: ticketEventReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
