import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wifi, WifiOff, Database, Clock, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  isOffline: boolean;
  lastSyncedMinutesAgo?: number;
  queuedCount?: number;
  onSyncNow?: () => void;
  isSyncing?: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOffline,
  lastSyncedMinutesAgo = 18,
  queuedCount = 0,
  onSyncNow,
  isSyncing = false,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`border-b-2 border-soil px-3 py-1.5 transition-colors text-xs font-mono select-none ${
        isOffline ? 'bg-amber-light border-soil' : 'bg-canvas-dark/60'
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full border border-soil ${
              isOffline ? 'bg-tomato animate-ping' : 'bg-leaf'
            }`}
          />
          <span className="font-bold text-soil flex items-center gap-1.5">
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-tomato" />
                <span>{t('offline.offline')}</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-leaf" />
                <span>{t('offline.online')}</span>
              </>
            )}
          </span>
        </div>

        {/* Market Pack & Cache info */}
        <div className="flex items-center gap-3 text-soil-muted text-[11px]">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-soil" />
            <span className="hidden sm:inline">{t('offline.packStatus')}</span>
            <span className="sm:hidden">Pack: 5 Mandis</span>
          </span>

          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-soil" />
            <span>Synced {lastSyncedMinutesAgo}m ago</span>
          </span>

          {queuedCount > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-amber text-soil font-bold border border-soil">
              {queuedCount} queued
            </span>
          )}

          {onSyncNow && (
            <button
              onClick={onSyncNow}
              disabled={isSyncing}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-soil text-[10px] font-bold shadow-neo-sm hover:bg-canvas active:translate-y-0.5"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
