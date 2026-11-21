import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Wifi, WifiOff, Volume2, Globe, Cpu, Users, BarChart3, Bell, Leaf, ChevronDown } from 'lucide-react';
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
    { id: 'decision', label: t('nav.home') },
    { id: 'compare', label: t('nav.compare') },
    { id: 'alerts', label: t('nav.alerts') },
    { id: 'groups', label: t('nav.groups') },
    { id: 'pipeline', label: t('nav.pipeline'), badge: 'AI' },
    { id: 'impact', label: t('nav.impact') },
  ];

  return (
    <header className="sticky top-0 z-40 px-3 sm:px-6 pt-3 pb-2">
      {/* Floating Modern Pill Header matching AgroFarm image */}
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md rounded-full border border-emerald-100 shadow-sm px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          onClick={() => setActiveTab('decision')}
        >
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg group-hover:bg-emerald-100 transition-colors">
            <Leaf className="w-5 h-5 fill-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-xl text-forest tracking-tight">
                Fasal<span className="text-emerald-600">Route</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'text-emerald-700 bg-emerald-50 font-bold'
                    : 'text-forest-muted hover:text-forest hover:bg-emerald-50/50'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
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
            title="Toggle online / offline simulation"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              isOfflineSimulated
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70 border border-emerald-100'
            }`}
          >
            {isOfflineSimulated ? (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Offline</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Online</span>
              </>
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentLang.nativeLabel}</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-emerald-100 rounded-2xl shadow-lg p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[10px] uppercase font-bold text-gray-400 px-3 py-1">
                  Language / ಭಾಷೆ
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      i18n.language === lang.code
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeLabel}</span>
                    </div>
                    {i18n.language === lang.code && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Navigation Strip */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 px-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-emerald-100'
              }`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
