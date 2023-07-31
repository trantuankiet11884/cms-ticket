import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { firestore } from "../../firebase/config";

interface ManageTicket {
  category: string;
  id: string;
  stt: string;
  bookingCode: string;
  numberTicket: string;
  status: string;
  dou: string;
  trd: string;
  gate: string;
  nameEvent: string;
}

interface FirestoreState {
  tickets: ManageTicket[];
  loading: boolean;
  error: string;
}

const initialState: FirestoreState = {
  tickets: [],
  loading: false,
  error: "",
};

export const fetchTickets = createAsyncThunk("ticket", async () => {
  const ticketRef = firestore.collection("manageTicket");
  const snapshot = await ticketRef.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ManageTicket[];
});

export const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTickets.fulfilled, (state, action) => {
      state.tickets = action.payload;
    });
  },
});

export const ticketReducer = ticketSlice.reducer;
