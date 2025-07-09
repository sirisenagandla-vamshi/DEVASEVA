

import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
  name: "user",
  initialState: null, // No user by default
  reducers: {
    // Set user data
    setUser: (state, action) => action.payload,

    // Clear user on logout
    clearUser: () => null,
  },
});

// Export actions and reducer
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
