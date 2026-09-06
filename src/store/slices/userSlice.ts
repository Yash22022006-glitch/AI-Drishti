import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, ReliefVoucher, UserRole } from '../../types';
import { INITIAL_USER_PROFILE, INITIAL_RELIEF_VOUCHERS } from '../../data/seedData';

interface UserState {
  profile: UserProfile;
  vouchers: ReliefVoucher[];
}

const initialState: UserState = {
  profile: INITIAL_USER_PROFILE,
  vouchers: INITIAL_RELIEF_VOUCHERS,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserRole: (state, action: PayloadAction<UserRole>) => {
      state.profile.role = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    redeemVoucher: (state, action: PayloadAction<string>) => {
      const v = state.vouchers.find((vch) => vch.id === action.payload);
      if (v) {
        v.isRedeemed = true;
        state.profile.reliefWalletBalance += 250;
      }
    },
    addReliefPoints: (state, action: PayloadAction<number>) => {
      state.profile.reliefWalletBalance += action.payload;
    },
    incrementIncidentCount: (state) => {
      state.profile.totalIncidentsReported += 1;
      state.profile.reliefWalletBalance += 500; // Reward citizen for verified local field reporting
    },
    addEmergencyContact: (
      state,
      action: PayloadAction<{ name: string; relationship: string; phone: string }>
    ) => {
      state.profile.emergencyContacts.push(action.payload);
    },
    setUserState: (state, action: PayloadAction<UserState>) => {
      state.profile = action.payload.profile;
      state.vouchers = action.payload.vouchers;
    },
  },
});

export const {
  setUserRole,
  updateProfile,
  redeemVoucher,
  addReliefPoints,
  incrementIncidentCount,
  addEmergencyContact,
  setUserState,
} = userSlice.actions;

export default userSlice.reducer;
