import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IncidentReport } from '../../types';
import { INITIAL_INCIDENTS } from '../../data/seedData';

interface IncidentsState {
  items: IncidentReport[];
  selectedCategory: string; // 'all' or category name
  selectedIncidentId: string | null;
  searchQuery: string;
}

const initialState: IncidentsState = {
  items: INITIAL_INCIDENTS,
  selectedCategory: 'all',
  selectedIncidentId: null,
  searchQuery: '',
};

export const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    addIncident: (state, action: PayloadAction<IncidentReport>) => {
      state.items.unshift(action.payload);
    },
    updateIncidentStatus: (state, action: PayloadAction<{ id: string; status: IncidentReport['status'] }>) => {
      const inc = state.items.find((i) => i.id === action.payload.id);
      if (inc) {
        inc.status = action.payload.status;
      }
    },
    markIncidentSynced: (state, action: PayloadAction<string>) => {
      const inc = state.items.find((i) => i.id === action.payload);
      if (inc) {
        inc.synced = true;
      }
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedIncidentId: (state, action: PayloadAction<string | null>) => {
      state.selectedIncidentId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setIncidents: (state, action: PayloadAction<IncidentReport[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addIncident,
  updateIncidentStatus,
  markIncidentSynced,
  setSelectedCategory,
  setSelectedIncidentId,
  setSearchQuery,
  setIncidents,
} = incidentsSlice.actions;

export default incidentsSlice.reducer;
