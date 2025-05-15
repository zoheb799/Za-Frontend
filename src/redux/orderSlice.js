import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../api/axios.js";

// Action to fetch all orders
export const fetchAllOrders = createAsyncThunk('orders/fetchAllOrders', async () => {
    try {
        const response = await axios.get('/api/v1/orders/my-orders');
        console.log(response.data.message,'ordrs');
        
        // Adjust the endpoint as needed
        return response.data.message;
    } catch (error) {
        throw Error(error.message);
    }
});

// Action to fetch order by ID
export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (orderId) => {
    try {
        const response = await axios.get(`/api/v1/orders/${orderId}`); // Adjust the endpoint as needed
        return response.data.data;
    } catch (error) {
        throw Error(error.message);
    }
});

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orderlists: [],
        currentOrder: null,
        status: 'idle', // idle, loading, succeeded, failed
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch All Orders
        builder.addCase(fetchAllOrders.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.orderlists = action.payload;
        });
        builder.addCase(fetchAllOrders.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });

        // Fetch Order by ID
        builder.addCase(fetchOrderById.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchOrderById.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.currentOrder = action.payload;
        });
        builder.addCase(fetchOrderById.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
    },
});

export default orderSlice.reducer;
