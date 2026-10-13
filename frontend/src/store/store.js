import { configureStore } from "@reduxjs/toolkit";
import invoiceDraftReducer from "./slices/invoiceDraftSlice";
const store=configureStore({
    reducer:{
         invoiceDraft: invoiceDraftReducer,
    }
})
export default store;