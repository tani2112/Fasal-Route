export interface MandiInfo {
  id: string;
  name: string;
  nameKn: string;
  nameHi: string;
  district: string;
  state: string;
  distanceKm: number;
  travelTimeHours: number;
  roadQualityFactor: number; // 1.0 = standard highway, 1.2 = rough state highway
  commissionRate: number; // 0.015 = 1.5%
}

export interface CropProfile {
  id: string;
  name: string;
  nameHi: string;
  nameKn: string;
  nameMr: string;
  nameTa: string;
  shelfLifeHours: number;
  shrinkageRatePerHour: number; // % lost per hour of rough road transit
  unitDefault: string;
  typicalLoadTonnes: number;
}

export interface MandiRateEntry {
  mandiId: string;
  cropId: string;
  pricePerQuintal: number; // in INR (1 quintal = 100 kg)
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  grade: 'A' | 'B' | 'Fair';
  arrivalsTonnes: number;
  lastUpdatedMinutesAgo: number;
}

export const CROPS: Record<string, CropProfile> = {
  tomato: {
    id: 'tomato',
    name: 'Tomato',
    nameHi: 'टमाटर',
    nameKn: 'ಟೊಮೇಟೊ',
    nameMr: 'टोमॅटो',
    nameTa: 'தக்காளி',
    shelfLifeHours: 48,
    shrinkageRatePerHour: 0.012, // 1.2% per transit hour on Indian rural roads
    unitDefault: 'kg',
    typicalLoadTonnes: 2.0,
  },
  onion: {
    id: 'onion',
    name: 'Onion',
    nameHi: 'प्याज',
    nameKn: 'ಈರುಳ್ಳಿ',
    nameMr: 'कांदा',
    nameTa: 'வெங்காயம்',
    shelfLifeHours: 360,
    shrinkageRatePerHour: 0.002,
    unitDefault: 'kg',
    typicalLoadTonnes: 3.5,
  },
  potato: {
    id: 'potato',
    name: 'Potato',
    nameHi: 'आलू',
    nameKn: 'ಆಲೂಗಡ್ಡೆ',
    nameMr: 'बटाटा',
    nameTa: 'உருளைக்கிழங்கு',
    shelfLifeHours: 720,
    shrinkageRatePerHour: 0.001,
    unitDefault: 'kg',
    typicalLoadTonnes: 4.0,
  },
};

export const MANDIS: Record<string, MandiInfo> = {
  kolar: {
    id: 'kolar',
    name: 'Kolar APMC (Local)',
    nameKn: 'ಕೋಲಾರ ಎಪಿಎಂಸಿ (ಸ್ಥಳೀಯ)',
    nameHi: 'कोलार एपीएमसी (स्थानीय)',
    district: 'Kolar',
    state: 'Karnataka',
    distanceKm: 0,
    travelTimeHours: 0,
    roadQualityFactor: 1.0,
    commissionRate: 0.015,
  },
  bengaluru_kr: {
    id: 'bengaluru_kr',
    name: 'Bengaluru KR Market',
    nameKn: 'ಬೆಂಗಳೂರು ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆ',
    nameHi: 'बेंगलुरु के.आर. मार्केट',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    distanceKm: 65,
    travelTimeHours: 2.2,
    roadQualityFactor: 1.05,
    commissionRate: 0.02,
  },
  hosakote: {
    id: 'hosakote',
    name: 'Hosakote Mandi',
    nameKn: 'ಹೊಸಕೋಟೆ ಮಂಡಿ',
    nameHi: 'होसकोटे मंडी',
    district: 'Bengaluru Rural',
    state: 'Karnataka',
    distanceKm: 38,
    travelTimeHours: 1.1,
    roadQualityFactor: 1.0,
    commissionRate: 0.015,
  },
  chintamani: {
    id: 'chintamani',
    name: 'Chintamani APMC',
    nameKn: 'ಚಿಂತಾಮಣಿ ಎಪಿಎಂಸಿ',
    nameHi: 'चिंतामणि एपीएमसी',
    district: 'Chikkaballapura',
    state: 'Karnataka',
    distanceKm: 42,
    travelTimeHours: 1.3,
    roadQualityFactor: 1.15,
    commissionRate: 0.015,
  },
  malur: {
    id: 'malur',
    name: 'Malur Market Yard',
    nameKn: 'ಮಾಲೂರು ಮಾರುಕಟ್ಟೆ',
    nameHi: 'मालूर मंडी यार्ड',
    district: 'Kolar',
    state: 'Karnataka',
    distanceKm: 28,
    travelTimeHours: 0.8,
    roadQualityFactor: 1.1,
    commissionRate: 0.015,
  },
};

// Seeded real-time rates (Tomato Ramesh scenario calibrated: Kolar ₹1,850/qtl, KR Market ₹2,350/qtl)
export const SEEDED_RATES: MandiRateEntry[] = [
  // Tomato
  {
    mandiId: 'kolar',
    cropId: 'tomato',
    pricePerQuintal: 1850,
    modalPrice: 1850,
    minPrice: 1700,
    maxPrice: 1950,
    grade: 'A',
    arrivalsTonnes: 140,
    lastUpdatedMinutesAgo: 15,
  },
  {
    mandiId: 'bengaluru_kr',
    cropId: 'tomato',
    pricePerQuintal: 2350,
    modalPrice: 2350,
    minPrice: 2200,
    maxPrice: 2500,
    grade: 'A',
    arrivalsTonnes: 320,
    lastUpdatedMinutesAgo: 22,
  },
  {
    mandiId: 'hosakote',
    cropId: 'tomato',
    pricePerQuintal: 2050,
    modalPrice: 2050,
    minPrice: 1950,
    maxPrice: 2150,
    grade: 'A',
    arrivalsTonnes: 85,
    lastUpdatedMinutesAgo: 45,
  },
  {
    mandiId: 'chintamani',
    cropId: 'tomato',
    pricePerQuintal: 1820,
    modalPrice: 1820,
    minPrice: 1750,
    maxPrice: 1900,
    grade: 'A',
    arrivalsTonnes: 60,
    lastUpdatedMinutesAgo: 30,
  },
  {
    mandiId: 'malur',
    cropId: 'tomato',
    pricePerQuintal: 1920,
    modalPrice: 1920,
    minPrice: 1850,
    maxPrice: 1980,
    grade: 'A',
    arrivalsTonnes: 45,
    lastUpdatedMinutesAgo: 60,
  },

  // Onion
  {
    mandiId: 'kolar',
    cropId: 'onion',
    pricePerQuintal: 2400,
    modalPrice: 2400,
    minPrice: 2200,
    maxPrice: 2550,
    grade: 'A',
    arrivalsTonnes: 90,
    lastUpdatedMinutesAgo: 40,
  },
  {
    mandiId: 'bengaluru_kr',
    cropId: 'onion',
    pricePerQuintal: 2850,
    modalPrice: 2850,
    minPrice: 2700,
    maxPrice: 3000,
    grade: 'A',
    arrivalsTonnes: 410,
    lastUpdatedMinutesAgo: 18,
  },
  {
    mandiId: 'hosakote',
    cropId: 'onion',
    pricePerQuintal: 2600,
    modalPrice: 2600,
    minPrice: 2500,
    maxPrice: 2700,
    grade: 'A',
    arrivalsTonnes: 55,
    lastUpdatedMinutesAgo: 50,
  },
  {
    mandiId: 'chintamani',
    cropId: 'onion',
    pricePerQuintal: 2350,
    modalPrice: 2350,
    minPrice: 2250,
    maxPrice: 2450,
    grade: 'A',
    arrivalsTonnes: 40,
    lastUpdatedMinutesAgo: 90,
  },
  {
    mandiId: 'malur',
    cropId: 'onion',
    pricePerQuintal: 2450,
    modalPrice: 2450,
    minPrice: 2380,
    maxPrice: 2520,
    grade: 'A',
    arrivalsTonnes: 30,
    lastUpdatedMinutesAgo: 70,
  },

  // Potato
  {
    mandiId: 'kolar',
    cropId: 'potato',
    pricePerQuintal: 1600,
    modalPrice: 1600,
    minPrice: 1500,
    maxPrice: 1700,
    grade: 'A',
    arrivalsTonnes: 70,
    lastUpdatedMinutesAgo: 35,
  },
  {
    mandiId: 'bengaluru_kr',
    cropId: 'potato',
    pricePerQuintal: 1980,
    modalPrice: 1980,
    minPrice: 1880,
    maxPrice: 2100,
    grade: 'A',
    arrivalsTonnes: 260,
    lastUpdatedMinutesAgo: 25,
  },
  {
    mandiId: 'hosakote',
    cropId: 'potato',
    pricePerQuintal: 1750,
    modalPrice: 1750,
    minPrice: 1650,
    maxPrice: 1820,
    grade: 'A',
    arrivalsTonnes: 45,
    lastUpdatedMinutesAgo: 55,
  },
  {
    mandiId: 'chintamani',
    cropId: 'potato',
    pricePerQuintal: 1580,
    modalPrice: 1580,
    minPrice: 1500,
    maxPrice: 1650,
    grade: 'A',
    arrivalsTonnes: 35,
    lastUpdatedMinutesAgo: 80,
  },
  {
    mandiId: 'malur',
    cropId: 'potato',
    pricePerQuintal: 1650,
    modalPrice: 1650,
    minPrice: 1580,
    maxPrice: 1710,
    grade: 'A',
    arrivalsTonnes: 25,
    lastUpdatedMinutesAgo: 65,
  },
];

export const DIESEL_PRICE_PER_LITER = 92.0;
export const VEHICLE_BASE_FREIGHT_PER_KM = 18.0; // ₹18 per km roundtrip/single load mini truck
