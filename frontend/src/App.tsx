import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from './components/common/Navbar';
import { OfflineBanner } from './components/common/OfflineBanner';
import { VoiceDecisionPage } from './pages/VoiceDecisionPage';
import { MandiCompare } from './components/mandi/MandiCompare';
import { PriceAlerts } from './components/alerts/PriceAlerts';
import { GroupSelling } from './components/group/GroupSelling';
import { SarvamPipelinePanel } from './components/pipeline/SarvamPipelinePanel';
import { ImpactAboutPage } from './pages/ImpactAboutPage';
import type { SarvamPipelineResult } from './lib/mockSarvam';

export const App: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('decision');
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const [lastPipelineResult, setLastPipelineResult] = useState<SarvamPipelineResult | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Register service worker if available
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW registration skipped:', err);
      });
    }
  }, []);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-canvas text-soil flex flex-col font-sans selection:bg-amber selection:text-soil">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOfflineSimulated={isOfflineSimulated}
        setIsOfflineSimulated={setIsOfflineSimulated}
      />

      {/* Offline Status & Dev Simulation Banner */}
      <OfflineBanner
        isOffline={isOfflineSimulated}
        lastSyncedMinutesAgo={isOfflineSimulated ? 240 : 18}
        queuedCount={isOfflineSimulated ? 2 : 0}
        onSyncNow={handleSyncNow}
        isSyncing={isSyncing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {activeTab === 'decision' && (
          <VoiceDecisionPage
            isOffline={isOfflineSimulated}
            onPipelineUpdate={(res) => setLastPipelineResult(res)}
          />
        )}

        {activeTab === 'compare' && <MandiCompare />}

        {activeTab === 'alerts' && <PriceAlerts />}

        {activeTab === 'groups' && <GroupSelling />}

        {activeTab === 'pipeline' && (
          <SarvamPipelinePanel pipelineData={lastPipelineResult} />
        )}

        {activeTab === 'impact' && <ImpactAboutPage />}
      </main>

      {/* Footer with Neo-Brutalist Agricultural Accent */}
      <footer className="border-t-2 border-soil bg-white py-6 px-4 sm:px-6 mt-12 text-xs font-mono text-soil">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber border border-soil flex items-center justify-center font-bold text-xs">
              ₹
            </div>
            <span className="font-bold font-display text-sm">FasalRoute</span>
            <span className="text-soil-muted">· Team ex-ONYX</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-soil-muted">
            <span>Powered by Sarvam AI</span>
            <span>·</span>
            <span>Offline-Ready PWA</span>
            <span>·</span>
            <span>Agmarknet Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
