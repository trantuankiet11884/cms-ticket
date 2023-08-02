import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { firestore } from "../../firebase/config";
import "firebase/compat/firestore";
interface PackageTicket {
  id?: string;
  codePackage: string;
  name: string;
  dou: string;
  trd: string;
  price: string;
  priceCombo: string;
  numberTicket: number;
  status: string;
}

interface FriestoreState {
  packageTicket: PackageTicket[];
  loading: boolean;
  error: string;
}

const initialState: FriestoreState = {
  packageTicket: [],
  loading: false,
  error: "",
};

export const fetchPackageTicket = createAsyncThunk(
  "packageTicket",
  async () => {
    const packageTicketRef = firestore.collection("packageTicket");
    const snapshot = await packageTicketRef.get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PackageTicket[];
  }
);

export const addPackageTicket = createAsyncThunk(
  "packageTicket/add",
  async (newTicket: PackageTicket) => {
    try {
      const packageTicketRef = firestore.collection("packageTicket");
      const newPKT = await packageTicketRef.add(newTicket);
      const pktSnapshot = await newPKT.get();
      const newpkt = {
        id: pktSnapshot.id,
        ...pktSnapshot.data(),
      } as PackageTicket;
      return newpkt;
    } catch (error) {
      throw new Error("Error adding package ticket: " + error);
    }
  }
);

export const updatePackageTicket = createAsyncThunk(
  "packageTicket/update",
  async ({
    id,
    updatedTicket,
  }: {
    id: string;
    updatedTicket: PackageTicket;
  }) => {
    try {
      const packageTicketRef = firestore.collection("packageTicket").doc(id);
      await packageTicketRef.update(updatedTicket);
      return { id, ...updatedTicket };
    } catch (error) {
      throw new Error("Error updating package ticket: " + error);
    }
  }
);

export const packageTicketSlice = createSlice({
  name: "packageTicket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPackageTicket.fulfilled, (state, action) => {
      state.packageTicket = action.payload;
    });
    builder.addCase(addPackageTicket.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.packageTicket.push(action.payload);
    });
    builder.addCase(updatePackageTicket.fulfilled, (state, action) => {
      const updatedTicket = action.payload;
      const index = state.packageTicket.findIndex(
        (ticket) => ticket.id === updatedTicket.id
      );
      if (index !== -1) {
        state.packageTicket[index] = updatedTicket;
      }
    });
  },
});

export const packageTicketReducer = packageTicketSlice.reducer;
