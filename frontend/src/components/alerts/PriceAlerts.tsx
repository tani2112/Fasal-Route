import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, BellRing, Plus, ArrowUpRight, ArrowDownRight, MessageSquare, PhoneCall, Check, Trash2 } from 'lucide-react';

interface AlertItem {
  id: string;
  crop: string;
  cropName: string;
  targetMandi: string;
  thresholdPrice: number;
  condition: 'above' | 'below';
  currentPrice: number;
  channel: 'whatsapp' | 'sms' | 'voice_call';
  isActive: boolean;
  lastTriggered?: string;
}

export const PriceAlerts: React.FC = () => {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: '1',
      crop: 'tomato',
      cropName: 'Tomato (Grade-A)',
      targetMandi: 'Bengaluru KR Market',
      thresholdPrice: 2200,
      condition: 'above',
      currentPrice: 2350,
      channel: 'whatsapp',
      isActive: true,
      lastTriggered: 'Triggered 2 hrs ago',
    },
    {
      id: '2',
      crop: 'onion',
      cropName: 'Onion (Medium)',
      targetMandi: 'Hosakote Mandi',
      thresholdPrice: 2700,
      condition: 'above',
      currentPrice: 2600,
      channel: 'sms',
      isActive: true,
    },
    {
      id: '3',
      crop: 'potato',
      cropName: 'Potato (Jyoti)',
      targetMandi: 'Kolar APMC',
      thresholdPrice: 1500,
      condition: 'below',
      currentPrice: 1600,
      channel: 'voice_call',
      isActive: false,
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [voiceQueryText, setVoiceQueryText] = useState('');

  const handleCreateVoiceAlert = (text: string) => {
    const newAlert: AlertItem = {
      id: Date.now().toString(),
      crop: 'tomato',
      cropName: 'Tomato (Grade-A)',
      targetMandi: 'Bengaluru KR Market',
      thresholdPrice: 2200,
      condition: 'above',
      currentPrice: 2350,
      channel: 'whatsapp',
      isActive: true,
    };
    setAlerts([newAlert, ...alerts]);
    setIsCreating(false);
    setVoiceQueryText('');
  };

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-soil/20 pb-4">
        <div>
          <div className="neo-pill bg-amber/20 text-soil border-soil mb-2">
            ● VOICE-ACTIVATED MONITORING
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-soil">
            {t('alerts.title')}
          </h2>
          <p className="text-sm text-soil-muted mt-1">
            {t('alerts.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="neo-btn-primary px-4 py-2.5 text-xs font-bold self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Voice Alert</span>
        </button>
      </div>

      {/* Voice Alert Creation Modal / Box */}
      {isCreating && (
        <div className="bg-white border-3 border-soil rounded-2xl p-5 shadow-neo-lg animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-soil/20">
            <span className="font-bold text-sm text-soil font-mono flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber" />
              <span>Say Your Alert Condition</span>
            </span>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs font-mono font-bold text-soil-muted hover:text-soil"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-soil-muted my-3">
            Speak naturally: e.g. "Alert me on WhatsApp if tomato price in KR Market crosses ₹2,200"
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="e.g. KR Market tomato > ₹2200 via WhatsApp"
              value={voiceQueryText}
              onChange={(e) => setVoiceQueryText(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border-2 border-soil font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber"
            />
            <button
              onClick={() => handleCreateVoiceAlert(voiceQueryText || 'KR Market tomato > 2200')}
              className="neo-btn-primary px-4 py-2 text-xs"
            >
              Save Alert
            </button>
          </div>
        </div>
      )}

      {/* Channel Adapter Status Notice */}
      <div className="bg-canvas-light border-2 border-soil rounded-2xl p-4 shadow-neo-sm flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="font-bold text-soil flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-leaf" />
            <span>WhatsApp Gateway: Connected (Stub)</span>
          </span>
          <span className="font-bold text-soil flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-amber" />
            <span>IVR Spoken Call: Ready (Stub)</span>
          </span>
        </div>
        <span className="text-[11px] text-soil-muted">Polling every 15 mins</span>
      </div>

      {/* Active Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
              alert.isActive
                ? 'bg-white border-soil shadow-neo'
                : 'bg-canvas-dark/40 border-soil/40 opacity-70'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl border-2 border-soil flex items-center justify-center font-bold ${
                    alert.isActive ? 'bg-amber text-soil' : 'bg-canvas-dark text-soil-muted'
                  }`}
                >
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-soil text-base">
                      {alert.cropName} @ {alert.targetMandi}
                    </h3>
                    {alert.lastTriggered && (
                      <span className="px-2 py-0.5 rounded-full bg-tomato text-white text-[10px] font-mono font-bold animate-pulse">
                        TRIGGERED
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-soil-muted font-mono mt-0.5 flex items-center gap-2">
                    <span>
                      Notify when {alert.condition === 'above' ? '≥' : '≤'} ₹{alert.thresholdPrice}/qtl
                    </span>
                    <span>·</span>
                    <span className="uppercase text-leaf font-bold">Via {alert.channel}</span>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-soil/20 pt-2 sm:pt-0">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-soil-muted uppercase block">
                    Current Rate
                  </span>
                  <span className="text-lg font-black font-mono text-soil flex items-center gap-0.5">
                    ₹{alert.currentPrice}/qtl
                    {alert.currentPrice >= alert.thresholdPrice ? (
                      <ArrowUpRight className="w-4 h-4 text-leaf" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-tomato" />
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 ml-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`px-3 py-1.5 rounded-lg border-2 border-soil text-xs font-bold transition-all ${
                      alert.isActive
                        ? 'bg-soil text-white'
                        : 'bg-white text-soil hover:bg-canvas'
                    }`}
                  >
                    {alert.isActive ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="p-1.5 rounded-lg border border-soil/30 text-soil-muted hover:text-tomato hover:bg-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
