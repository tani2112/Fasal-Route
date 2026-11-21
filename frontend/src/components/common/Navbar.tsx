import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Wifi, WifiOff, Volume2, Globe, Cpu, Users, BarChart3, Bell, Leaf, Sparkles } from 'lucide-react';
import { languages, changeLanguage, type SupportedLanguage } from '../../i18n/i18n';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOfflineSimulated: boolean;
  setIsOfflineSimulated: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isOfflineSimulated,
  setIsOfflineSimulated,
}) => {
  const { t, i18n } = useTranslation();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  const navItems = [
    { id: 'decision', label: t('nav.home'), icon: Volume2 },
    { id: 'compare', label: t('nav.compare'), icon: BarChart3 },
    { id: 'alerts', label: t('nav.alerts'), icon: Bell },
    { id: 'groups', label: t('nav.groups'), icon: Users },
    { id: 'pipeline', label: t('nav.pipeline'), icon: Cpu, badge: 'SARVAM' },
    { id: 'impact', label: t('nav.impact'), icon: Leaf },
  ];

  return (
    <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-md border-b-2 border-soil px-3 sm:px-6 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo and Brand */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group select-none"
          onClick={() => setActiveTab('decision')}
        >
          <div className="w-10 h-10 rounded-xl bg-amber border-2 border-soil shadow-neo-sm flex items-center justify-center font-bold text-lg text-soil group-hover:-translate-y-0.5 group-hover:shadow-neo transition-all">
            <span className="font-mono text-xl">₹</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-xl tracking-tight text-soil">
                FasalRoute
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono px-1.5 py-0.5 rounded bg-leaf/10 border border-leaf text-leaf font-semibold">
                v1.0
              </span>
            </div>
            <div className="text-[10px] font-mono text-soil-muted font-medium flex items-center gap-1">
              <span>ex-ONYX</span>
              <span>·</span>
              <span className="text-leaf font-semibold">Voice Co-Pilot</span>
            </div>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/70 p-1 rounded-full border-2 border-soil shadow-neo-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 select-none ${
                  isActive
                    ? 'bg-soil text-white shadow-sm'
                    : 'text-soil hover:bg-canvas-dark text-soil-muted'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber' : ''}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    isActive ? 'bg-amber text-soil font-black' : 'bg-amber/20 text-soil font-bold'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Dev Offline Toggle + Language Selector */}
        <div className="flex items-center gap-2">
          {/* Offline Dev Simulation Pill */}
          <button
            onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
            title={isOfflineSimulated ? 'Offline mode active (Click to simulate online)' : 'Online mode active (Click to simulate offline)'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border-2 border-soil text-[11px] font-mono font-bold shadow-neo-sm transition-all ${
              isOfflineSimulated
                ? 'bg-tomato text-white animate-pulse'
                : 'bg-leaf/20 text-forest hover:bg-leaf/30'
            }`}
          >
            {isOfflineSimulated ? (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">OFFLINE SIM</span>
                <span className="sm:hidden">OFF</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-leaf" />
                <span className="hidden sm:inline">ONLINE</span>
                <span className="sm:hidden">ON</span>
              </>
            )}
          </button>

          {/* Language Selector Button */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border-2 border-soil text-xs font-bold shadow-neo-sm hover:shadow-neo transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-leaf" />
              <span className="font-semibold">{currentLang.nativeLabel}</span>
              <span className="text-[10px] text-soil-muted font-mono uppercase">{currentLang.code}</span>
            </button>

            {/* Language Dropdown Modal/Menu */}
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border-2 border-soil rounded-2xl shadow-neo-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[11px] font-mono uppercase tracking-wider text-soil-muted px-2 py-1 border-b border-soil/20 mb-1 font-bold">
                  Select Language / ಭಾಷೆ
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                      i18n.language === lang.code
                        ? 'bg-amber/30 border border-soil font-bold'
                        : 'hover:bg-canvas font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <div>
                        <div className="font-bold text-soil">{lang.nativeLabel}</div>
                        <div className="text-[10px] text-soil-muted">{lang.label} ({lang.region})</div>
                      </div>
                    </div>
                    {i18n.language === lang.code && (
                      <span className="w-2 h-2 rounded-full bg-forest"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Navigation Strip */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 pb-0.5 mt-1 border-t border-soil/15">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-soil text-white shadow-neo-sm'
                  : 'bg-white/80 border border-soil/40 text-soil'
              }`}
            >
              <Icon className={`w-3 h-3 ${isActive ? 'text-amber' : ''}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
