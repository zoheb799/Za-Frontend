import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modals: {
    media: false,
    doc: false,
  }
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    updateMediaModal(state, action) {
      state.modals.media = action.payload;
    },
    updateDocumentModal(state, action) {
      state.modals.doc = action.payload;
    },
  },
});

export default fileSlice.reducer;

export const ToggleMediaModal = (value) => async (dispatch, getState) => {
  dispatch(fileSlice.actions.updateMediaModal(value));
};
export const ToggleDocumentModal = (value) => async (dispatch, getState) => {
  dispatch(fileSlice.actions.updateDocumentModal(value));
};
