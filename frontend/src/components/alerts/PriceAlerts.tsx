import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, BellRing, Plus, ArrowUpRight, ArrowDownRight, MessageSquare, PhoneCall, Trash2 } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-100">
            ● Voice-Activated Monitoring
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest">
            {t('alerts.title')}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t('alerts.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="agro-btn-primary text-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Voice Alert</span>
        </button>
      </div>

      {isCreating && (
        <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm animate-in fade-in duration-150 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-forest flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>Say Your Alert Condition</span>
            </span>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-500">
            e.g. "Alert me on WhatsApp if tomato price in KR Market crosses ₹2,200"
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="e.g. KR Market tomato > ₹2200 via WhatsApp"
              value={voiceQueryText}
              onChange={(e) => setVoiceQueryText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleCreateVoiceAlert(voiceQueryText || 'KR Market tomato > 2200')}
              className="agro-btn-primary text-xs px-5"
            >
              Save Alert
            </button>
          </div>
        </div>
      )}

      {/* Channel Adapter Notice */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Gateway: Connected</span>
          </span>
          <span className="font-semibold text-gray-700 flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-amber-500" />
            <span>IVR Voice Call: Ready</span>
          </span>
        </div>
        <span className="text-gray-400 text-[11px]">Background polling active</span>
      </div>

      {/* Active Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-3xl bg-white border transition-all ${
              alert.isActive
                ? 'border-emerald-100 shadow-sm'
                : 'border-gray-100 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    alert.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-forest text-base">
                      {alert.cropName} @ {alert.targetMandi}
                    </h3>
                    {alert.lastTriggered && (
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                        TRIGGERED
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                    <span>
                      Notify when {alert.condition === 'above' ? '≥' : '≤'} ₹{alert.thresholdPrice}/qtl
                    </span>
                    <span>·</span>
                    <span className="uppercase text-emerald-700 font-semibold">Via {alert.channel}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0">
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block font-semibold">Current Rate</span>
                  <span className="text-lg font-bold font-mono text-forest flex items-center gap-0.5">
                    ₹{alert.currentPrice}/qtl
                    {alert.currentPrice >= alert.thresholdPrice ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      alert.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {alert.isActive ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100"
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
