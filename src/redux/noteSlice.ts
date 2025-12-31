import { createSlice } from "@reduxjs/toolkit";
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
  },
});

export const { setNote, clearNote } = noteSlice.actions;
export default noteSlice.reducer;
