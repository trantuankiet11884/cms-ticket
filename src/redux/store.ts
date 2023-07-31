import { configureStore } from "@reduxjs/toolkit";
import { ticketReducer } from "./manageTicket";
import { cpTicketReducer } from "./comparisonTicket";

export const store = configureStore({
  reducer: {
    ticket: ticketReducer,
    cpTicket: cpTicketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
