import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResponderMission } from '../../types';
import { INITIAL_RESPONDER_MISSIONS } from '../../data/seedData';

interface ResponderState {
  missions: ResponderMission[];
  selectedMissionId: string;
}

const initialState: ResponderState = {
  missions: INITIAL_RESPONDER_MISSIONS,
  selectedMissionId: INITIAL_RESPONDER_MISSIONS[0].id,
};

export const responderSlice = createSlice({
  name: 'responder',
  initialState,
  reducers: {
    setSelectedMissionId: (state, action: PayloadAction<string>) => {
      state.selectedMissionId = action.payload;
    },
    updateMissionStatus: (
      state,
      action: PayloadAction<{ id: string; status: ResponderMission['status'] }>
    ) => {
      const m = state.missions.find((mission) => mission.id === action.payload.id);
      if (m) {
        m.status = action.payload.status;
      }
    },
    addMissionLogNote: (
      state,
      action: PayloadAction<{ id: string; note: string }>
    ) => {
      const m = state.missions.find((mission) => mission.id === action.payload.id);
      if (m) {
        m.notes.unshift(`[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] ${action.payload.note}`);
      }
    },
    setMissions: (state, action: PayloadAction<ResponderMission[]>) => {
      state.missions = action.payload;
    },
  },
});

export const { setSelectedMissionId, updateMissionStatus, addMissionLogNote, setMissions } =
  responderSlice.actions;

export default responderSlice.reducer;
