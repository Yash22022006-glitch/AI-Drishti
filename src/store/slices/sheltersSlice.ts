import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shelter, EvacuationRoute } from '../../types';
import { INITIAL_SHELTERS } from '../../data/seedData';

interface SheltersState {
  items: Shelter[];
  selectedShelterId: string | null;
  activeRoute: EvacuationRoute | null;
}

const SAMPLE_EVAC_ROUTE: EvacuationRoute = {
  id: 'route-mayur-vihar',
  origin: 'Pandav Nagar Residential Sector (Current GPS)',
  destinationShelterId: 'sh-1',
  destinationName: 'Mayur Vihar Community Relief Complex',
  distanceKm: 1.4,
  estTimeMinutes: 8,
  safetyScore: 94,
  hazardWarnings: ['Avoid Yamuna Khadar Service Underpass (submerged 1.2m)'],
  steps: [
    {
      instruction: 'Head South on Mother Teresa Crescent toward Pandav Road',
      distance: '350 m',
      isSafe: true,
    },
    {
      instruction: 'Turn Left onto Elevated Ring Connector (Passes safely above river overflow line)',
      distance: '600 m',
      isSafe: true,
      hazardNote: 'High elevation embankment: zero flood water risk.',
    },
    {
      instruction: 'Continue straight through Metro Pillar #42 Checkpoint',
      distance: '300 m',
      isSafe: true,
    },
    {
      instruction: 'Arrive at Mayur Vihar Community Relief Complex (Gate 2 Medical Triage)',
      distance: '150 m',
      isSafe: true,
    },
  ],
};

const initialState: SheltersState = {
  items: INITIAL_SHELTERS,
  selectedShelterId: INITIAL_SHELTERS[0].id,
  activeRoute: SAMPLE_EVAC_ROUTE,
};

export const sheltersSlice = createSlice({
  name: 'shelters',
  initialState,
  reducers: {
    setSelectedShelterId: (state, action: PayloadAction<string | null>) => {
      state.selectedShelterId = action.payload;
    },
    claimShelterToken: (state, action: PayloadAction<string>) => {
      const shelter = state.items.find((s) => s.id === action.payload);
      if (shelter) {
        shelter.claimedToken = true;
        shelter.currentOccupancy = Math.min(shelter.capacity, shelter.currentOccupancy + 1);
      }
    },
    setActiveRoute: (state, action: PayloadAction<EvacuationRoute | null>) => {
      state.activeRoute = action.payload;
    },
    setShelters: (state, action: PayloadAction<Shelter[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setSelectedShelterId, claimShelterToken, setActiveRoute, setShelters } = sheltersSlice.actions;
export default sheltersSlice.reducer;
