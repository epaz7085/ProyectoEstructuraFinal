import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserProfileState = {
    email: string;
    displayName: string;
};

const initialState: UserProfileState = {
    email: "",
    displayName: "",
};

const userProfileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
        setUserProfile(state, action: PayloadAction<UserProfileState>) {
            state.email = action.payload.email;
            state.displayName = action.payload.displayName;
        },
        clearUserProfile(state) {
            state.email = "";
            state.displayName = "";
        },
    },
});

export const { setUserProfile, clearUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;