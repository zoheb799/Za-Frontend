import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all public products
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async () => {
    const response = await axios.get("/api/v1/product/all");
    return response.data.data;
  }
);

// Fetch logged-in user's own products
export const fetchMyProducts = createAsyncThunk(
  "product/fetchMyProducts",
  async () => {
    const response = await axios.get("/api/v1/product/my-products");
    return response.data.data;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    items: [],        // all products
    filtered: [],     // search filtered products
    myItems: [],      // user-specific products
    status: "idle",
    error: null,
  },
  reducers: {
    searchProducts: (state, action) => {
      const keyword = action.payload.toLowerCase().trim();
      state.filtered = keyword
        ? state.items.filter((product) =>
            product.title.toLowerCase().includes(keyword)
          )
        : state.items;
    },
  },
  extraReducers: (builder) => {
    builder
      // Public products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.filtered = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // My products
      .addCase(fetchMyProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myItems = action.payload;
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { searchProducts } = productSlice.actions;
export default productSlice.reducer;
