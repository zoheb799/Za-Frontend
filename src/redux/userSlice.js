import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const signinUser = createAsyncThunk(
    "user/signin",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/v1/auth/login", userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Signin failed"
            );
        }
    }
);

export const signupUser = createAsyncThunk(
    "user/signup", 
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/v1/auth/register", userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Signup failed"
            );
        }
    }
)
;



export const updateUser = createAsyncThunk(
    "user/profileUpdate",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                "/api/v1/auth/profile",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);


// Sign Out User
export const signOutUser = createAsyncThunk(
    "user/signout",
    async (_, { rejectWithValue }) => {
        try {
            await axios.post("/api/v1/auth/logout");
            return true;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Signout failed"
            );
        }
    }
);

// User Slice
const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        error: null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Signin
            .addCase(signinUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signinUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(signinUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Signin
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

           

            // Update
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Sign Out
            .addCase(signOutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signOutUser.fulfilled, (state) => {
                state.loading = false;
                state.currentUser = null;
            })
            .addCase(signOutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userSlice.reducer;
