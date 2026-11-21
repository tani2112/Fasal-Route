import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf } from 'lucide-react';
import { Navbar } from './components/common/Navbar';
import { OfflineBanner } from './components/common/OfflineBanner';
import { VoiceDecisionPage } from './pages/VoiceDecisionPage';
import { MandiCompare } from './components/mandi/MandiCompare';
import { PriceAlerts } from './components/alerts/PriceAlerts';
import { GroupSelling } from './components/group/GroupSelling';
import { SarvamPipelinePanel } from './components/pipeline/SarvamPipelinePanel';
import { ImpactAboutPage } from './pages/ImpactAboutPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import type { SarvamPipelineResult } from './lib/mockSarvam';

export const App: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('decision');
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const [lastPipelineResult, setLastPipelineResult] = useState<SarvamPipelineResult | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

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
    <div className="min-h-screen bg-[#F8FAF8] text-forest flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Floating Modern Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOfflineSimulated={isOfflineSimulated}
        setIsOfflineSimulated={setIsOfflineSimulated}
      />

      {/* Offline Status Banner */}
      <OfflineBanner
        isOffline={isOfflineSimulated}
        lastSyncedMinutesAgo={isOfflineSimulated ? 240 : 18}
        queuedCount={isOfflineSimulated ? 2 : 0}
        onSyncNow={handleSyncNow}
        isSyncing={isSyncing}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <ErrorBoundary>
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
        </ErrorBoundary>
      </main>

      {/* Modern AgroFarm Footer */}
      <footer className="border-t border-emerald-100 bg-white py-6 px-4 sm:px-6 mt-12 text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              <Leaf className="w-3.5 h-3.5 fill-emerald-600" />
            </div>
            <span className="font-bold font-display text-sm text-forest">FasalRoute</span>
            <span className="text-gray-400">· Team ex-ONYX</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400">
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
