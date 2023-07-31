import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { firestore } from "../../firebase/config";

interface ComparisionTicket {
  id: string;
  stt: string;
  codeTicket: string;
  dou: string;
  name: string;
  gate: string;
  isComparision: boolean;
}

interface FirestoreState {
  comparision: ComparisionTicket[];
  loading: boolean;
  error: string;
}

const initialState: FirestoreState = {
  comparision: [],
  loading: false,
  error: "",
};

export const fetchComparisionTicket = createAsyncThunk("cpticket", async () => {
  const cpticketRef = firestore.collection("comparisionTicket");
  const snapshot = await cpticketRef.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ComparisionTicket[];
});

export const cpTicketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchComparisionTicket.fulfilled, (state, action) => {
      state.comparision = action.payload;
    });
  },
});

export const cpTicketReducer = cpTicketSlice.reducer;
