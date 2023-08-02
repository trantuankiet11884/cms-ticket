import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { firestore } from "../../../firebase/config";

interface ManageEventTicket {
  category: string;
  id: string;
  bookingCode: string;
  numberTicket: string;
  status: string;
  dou: firebase.firestore.Timestamp;
  trd: firebase.firestore.Timestamp;
  gate: string;
  nameEvent: string;
}

interface FirestoreState {
  ticketEvents: ManageEventTicket[];
  loading: boolean;
  error: string;
}

const initialState: FirestoreState = {
  ticketEvents: [],
  loading: false,
  error: "",
};

export const fetchEventTickets = createAsyncThunk("ticketEvent", async () => {
  const ticketRef = firestore.collection("manageEventTicket");
  const snapshot = await ticketRef.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ManageEventTicket[];
});

export const ticketEventSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchEventTickets.fulfilled, (state, action) => {
      state.ticketEvents = action.payload;
    });
  },
});

export const ticketEventReducer = ticketEventSlice.reducer;
