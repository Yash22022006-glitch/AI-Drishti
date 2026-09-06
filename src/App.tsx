/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import { store, hydrateFromAsyncStorage } from './store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { DeviceFrame } from './components/DeviceFrame';
import { HomeScreen } from './components/screens/HomeScreen';
import { RiskMapScreen } from './components/screens/RiskMapScreen';
import { SosScreen } from './components/screens/SosScreen';
import { IncidentsScreen } from './components/screens/IncidentsScreen';
import { SheltersScreen } from './components/screens/SheltersScreen';
import { ResponderScreen } from './components/screens/ResponderScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';

import { IncidentReportModal } from './components/modals/IncidentReportModal';
import { EvacuationRouteModal } from './components/modals/EvacuationRouteModal';
import { ExplainableAiModal } from './components/modals/ExplainableAiModal';
import { OfflineSyncModal } from './components/modals/OfflineSyncModal';

const AppContent: React.FC = () => {
  const activeTab = useAppSelector((s) => s.ui.activeTab);
  const userRole = useAppSelector((s) => s.user.profile.role);
  const themeMode = useAppSelector((s) => s.ui.themeMode);

  // Sync html class for dark mode styling
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // Screen routing with motion layout animations
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return userRole === 'responder' ? <ResponderScreen /> : <HomeScreen />;
      case 'map':
        return <RiskMapScreen />;
      case 'sos':
        return <SosScreen />;
      case 'incidents':
        return <IncidentsScreen />;
      case 'shelters':
        return <SheltersScreen />;
      case 'profile':
        return <SheltersScreen initialSubTab="profile" />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <DeviceFrame>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTab}-${userRole}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="w-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {/* Global Modals */}
      <IncidentReportModal />
      <EvacuationRouteModal />
      <ExplainableAiModal />
      <OfflineSyncModal />
    </DeviceFrame>
  );
};

export default function App() {
  useEffect(() => {
    // Asynchronously rehydrate Redux store from AsyncStorage
    hydrateFromAsyncStorage();
  }, []);

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
