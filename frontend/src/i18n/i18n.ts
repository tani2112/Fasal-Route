import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import kn from './locales/kn.json';
import mr from './locales/mr.json';
import ta from './locales/ta.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  kn: { translation: kn },
  mr: { translation: mr },
  ta: { translation: ta },
};

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('fasalroute_lang') || 'en' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export const languages = [
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', flag: '🇮🇳', region: 'North/Central' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', flag: '🌾', region: 'Karnataka (Kolar)' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', flag: '🚜', region: 'Maharashtra' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🌱', region: 'Tamil Nadu' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🌐', region: 'Pan-India' },
] as const;

export type SupportedLanguage = typeof languages[number]['code'];

export const changeLanguage = (lang: SupportedLanguage) => {
  i18n.changeLanguage(lang);
  if (typeof window !== 'undefined') {
    localStorage.setItem('fasalroute_lang', lang);
    document.documentElement.lang = lang;
  }
};

export default i18n;
