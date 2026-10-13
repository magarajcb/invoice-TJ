import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customer: "",
  items: [],
  discountPercentage: 0,
  taxPercentage: 18,
};

const invoiceDraftSlice = createSlice({
  name: "invoiceDraft",
  initialState,
  reducers: {
    setCustomer(state, action) {
      state.customer = action.payload;
    },

    setItems(state, action) {
      state.items = action.payload;
    },

    setDiscount(state, action) {
      state.discountPercentage = action.payload;
    },

    setTax(state, action) {
      state.taxPercentage = action.payload;
    },

    clearDraft() {
      return initialState;
    },
  },
});

export const {
  setCustomer,
  setItems,
  setDiscount,
  setTax,
  clearDraft,
} = invoiceDraftSlice.actions;

export default invoiceDraftSlice.reducer;