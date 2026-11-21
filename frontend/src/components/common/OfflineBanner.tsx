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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1">
      <div
        className={`rounded-2xl px-3.5 py-1.5 text-xs font-sans transition-all flex flex-wrap items-center justify-between gap-2 border ${
          isOffline
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50/60 border-emerald-100 text-emerald-900'
        }`}
      >
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isOffline ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'
            }`}
          />
          <span className="font-semibold flex items-center gap-1.5">
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span>{t('offline.offline')}</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('offline.online')}</span>
              </>
            )}
          </span>
        </div>

        {/* Market Pack & Cache info */}
        <div className="flex items-center gap-3 text-gray-500 text-[11px]">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-600" />
            <span className="hidden sm:inline">{t('offline.packStatus')}</span>
            <span className="sm:hidden">5 Mandis Cached</span>
          </span>

          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span>Synced {lastSyncedMinutesAgo}m ago</span>
          </span>

          {queuedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
              {queuedCount} queued
            </span>
          )}

          {onSyncNow && (
            <button
              onClick={onSyncNow}
              disabled={isSyncing}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-200 shadow-xs hover:bg-emerald-50 text-[11px] font-semibold transition-all"
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
