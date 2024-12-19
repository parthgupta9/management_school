import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch user data
export const fetchUser = createAsyncThunk(
    "profile/fetchUser",
    async (userId) => {
        const response = await fetch(`http://localhost:5000/users/${userId}`);
        if (!response.ok) {
            throw new Error("Error fetching user data");
        }
        return response.json();
    }
);

// Async thunk to update user data
export const updateUser = createAsyncThunk(
    "profile/updateUser",
    async (updatedUser) => {
        const response = await fetch(`http://localhost:5000/users/${updatedUser._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
        });
        if (!response.ok) {
            throw new Error("Error updating user data");
        }
        return response.json();
    }
);

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        currentUser: null,
        status: "idle", // idle | loading | succeeded | failed
        error: null,
        editMode: false,
    },
    reducers: {
        toggleEditMode: (state) => {
            state.editMode = !state.editMode;
        },
        setUser: (state, action) => {
            state.currentUser = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.currentUser = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(updateUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.currentUser = action.payload;
                state.editMode = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export const { toggleEditMode, setUser } = profileSlice.actions;
export default profileSlice.reducer;
