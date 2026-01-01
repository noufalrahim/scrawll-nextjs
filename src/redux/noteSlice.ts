import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { TNote } from "@/types";

export interface INoteState {
  entity: TNote | null;
}

const initialState: INoteState = {
  entity: null,
};

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    setNote: (state, action) => {
      state.entity = action.payload;
    },
    clearNote: (state) => {
      state.entity = null;
    },
    exportNote: (state, action) => {
      state.entity = action.payload;
    },
    clearExport: (state) => {
      state.entity = null;
    },
  },
});

export const { setNote, clearNote, exportNote, clearExport } = noteSlice.actions;
export default noteSlice.reducer;
