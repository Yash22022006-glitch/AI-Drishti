import { configureStore, Middleware } from '@reduxjs/toolkit';
import riskReducer from './slices/riskSlice';
import incidentsReducer, { setIncidents } from './slices/incidentsSlice';
import sheltersReducer, { setShelters } from './slices/sheltersSlice';
import offlineSyncReducer from './slices/offlineSyncSlice';
import userReducer, { setUserState } from './slices/userSlice';
import uiReducer from './slices/uiSlice';
import responderReducer, { setMissions } from './slices/responderSlice';
import AsyncStorage from '../storage/asyncStorage';

// Key names for AsyncStorage persistence
export const STORAGE_KEYS = {
  INCIDENTS: 'STORAGE_KEY_INCIDENTS_V1',
  SHELTERS: 'STORAGE_KEY_SHELTERS_V1',
  USER_DATA: 'STORAGE_KEY_USER_V1',
  RESPONDER: 'STORAGE_KEY_RESPONDER_V1',
  OFFLINE_QUEUE: 'STORAGE_KEY_OFFLINE_QUEUE_V1',
  SETTINGS: 'STORAGE_KEY_SETTINGS_V1',
};

// Persistence middleware: synchronizes state changes to AsyncStorage debounced
let timeoutId: any = null;
const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  // Debounce persistence writes to simulate smooth mobile storage bridge
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    try {
      AsyncStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(state.incidents.items));
      AsyncStorage.setItem(STORAGE_KEYS.SHELTERS, JSON.stringify(state.shelters.items));
      AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify({ profile: state.user.profile, vouchers: state.user.vouchers })
      );
      AsyncStorage.setItem(STORAGE_KEYS.RESPONDER, JSON.stringify(state.responder.missions));
      AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(state.offlineSync.queue));
      AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify({ themeMode: state.ui.themeMode, platform: state.ui.platform })
      );
    } catch (err) {
      console.warn('[Redux -> AsyncStorage] Persistence error:', err);
    }
  }, 100);

  return result;
};

export const store = configureStore({
  reducer: {
    risk: riskReducer,
    incidents: incidentsReducer,
    shelters: sheltersReducer,
    offlineSync: offlineSyncReducer,
    user: userReducer,
    ui: uiReducer,
    responder: responderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(persistenceMiddleware),
});

// Hydrate store from AsyncStorage asynchronously on application start
export async function hydrateFromAsyncStorage() {
  try {
    const [incidentsRaw, sheltersRaw, userRaw, responderRaw] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.INCIDENTS),
      AsyncStorage.getItem(STORAGE_KEYS.SHELTERS),
      AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
      AsyncStorage.getItem(STORAGE_KEYS.RESPONDER),
    ]);

    if (incidentsRaw) {
      try {
        const parsed = JSON.parse(incidentsRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          store.dispatch(setIncidents(parsed));
        }
      } catch (e) {
        console.error('Failed parsing cached incidents', e);
      }
    }

    if (sheltersRaw) {
      try {
        const parsed = JSON.parse(sheltersRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          store.dispatch(setShelters(parsed));
        }
      } catch (e) {
        console.error('Failed parsing cached shelters', e);
      }
    }

    if (userRaw) {
      try {
        const parsed = JSON.parse(userRaw);
        if (parsed?.profile) {
          store.dispatch(setUserState(parsed));
        }
      } catch (e) {
        console.error('Failed parsing cached user', e);
      }
    }

    if (responderRaw) {
      try {
        const parsed = JSON.parse(responderRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          store.dispatch(setMissions(parsed));
        }
      } catch (e) {
        console.error('Failed parsing cached responder', e);
      }
    }
  } catch (err) {
    console.warn('[AsyncStorage] Hydration error:', err);
  }
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
