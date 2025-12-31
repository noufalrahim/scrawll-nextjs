import { configureStore } from "@reduxjs/toolkit";
import noteReducer from "./noteSlice";
import userReducer from "./userSlice";
import workspaceReducer from "./workspaceSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    workspace: workspaceReducer,
    note: noteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
