import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RiskZone } from '../../types';
import { INITIAL_RISK_ZONES } from '../../data/seedData';

interface RiskState {
  zones: RiskZone[];
  selectedZoneId: string;
  isSimulating: boolean;
  simulatedRainfallIncreasePercent: number;
  lastForecastTime: string;
}

const initialState: RiskState = {
  zones: INITIAL_RISK_ZONES,
  selectedZoneId: INITIAL_RISK_ZONES[0].id,
  isSimulating: false,
  simulatedRainfallIncreasePercent: 0,
  lastForecastTime: 'Live (IMD Radar + NWIC Telemetry)',
};

export const riskSlice = createSlice({
  name: 'risk',
  initialState,
  reducers: {
    setSelectedZone: (state, action: PayloadAction<string>) => {
      state.selectedZoneId = action.payload;
    },
    setSimulatedRainfall: (state, action: PayloadAction<number>) => {
      state.simulatedRainfallIncreasePercent = action.payload;
      state.isSimulating = action.payload > 0;

      // Dynamically recalculate risk scores based on ML model formula from CONTEXT.md
      const baseZones = INITIAL_RISK_ZONES;
      state.zones = baseZones.map((z) => {
        const factor = 1 + action.payload / 100;
        const newRainfall = Number((z.rainfall24h * factor).toFixed(1));
        const newScore = Math.min(100, Math.round(z.riskScore * (1 + (action.payload * 0.35) / 100)));
        const newSoil = Math.min(100, Number((z.soilMoistureSaturation * (1 + (action.payload * 0.1) / 100)).toFixed(1)));
        const newRiver = Number((z.riverLevel + (action.payload * 0.015)).toFixed(2));

        let severity: RiskZone['severity'] = 'LOW';
        if (newScore > 80) severity = 'CRITICAL';
        else if (newScore > 60) severity = 'HIGH';
        else if (newScore > 30) severity = 'MODERATE';

        return {
          ...z,
          riskScore: newScore,
          severity,
          rainfall24h: newRainfall,
          riverLevel: newRiver,
          soilMoistureSaturation: newSoil,
          populationAtRisk: Math.round(z.populationAtRisk * (1 + (action.payload * 0.2) / 100)),
        };
      });
    },
    resetSimulation: (state) => {
      state.isSimulating = false;
      state.simulatedRainfallIncreasePercent = 0;
      state.zones = INITIAL_RISK_ZONES;
    },
  },
});

export const { setSelectedZone, setSimulatedRainfall, resetSimulation } = riskSlice.actions;
export default riskSlice.reducer;
