import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    logOutUserSuccess: false,
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
        },
        logOutUserSuccess: (state) => {
            state.currentUser = null;
        },
    }
});

export const { signInSuccess, logOutUserSuccess } = userSlice.actions;

export default userSlice.reducer;