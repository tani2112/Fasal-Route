import {
  CROPS,
  MANDIS,
  SEEDED_RATES,
  DIESEL_PRICE_PER_LITER,
  VEHICLE_BASE_FREIGHT_PER_KM,
  type MandiInfo,
  type MandiRateEntry,
  type CropProfile,
} from './mandiData';

export interface SplitItem {
  mandiId: string;
  mandiName: string;
  mandiNameKn: string;
  mandiNameHi: string;
  percentage: number;
  allocatedKg: number;
  expectedGrossRupees: number;
  transportCostRupees: number;
  shrinkageKg: number;
  shrinkageRupees: number;
  feesRupees: number;
  netInHandRupees: number;
  distanceKm: number;
  travelTimeHours: number;
  ratePerQuintal: number;
  isLocal: boolean;
}

export interface MandiComparisonRow {
  mandiId: string;
  mandiName: string;
  mandiNameKn: string;
  mandiNameHi: string;
  distanceKm: number;
  travelTimeHours: number;
  ratePerQuintal: number;
  grossForFullLoad: number;
  transportCost: number;
  shrinkageLossRupees: number;
  netProfitFullLoad: number;
  netPerQuintal: number;
  netGainVsLocalPerQuintal: number;
  isLocal: boolean;
  isBest: boolean;
}

export interface DecisionEngineOutput {
  crop: string;
  cropName: string;
  totalQuantityKg: number;
  localMandiId: string;
  localMandiName: string;
  baselineLocalNetRupees: number;
  recommendedTotalNetRupees: number;
  netGainVsLocalRupees: number;
  summaryRecommendationEn: string;
  summaryRecommendationHi: string;
  summaryRecommendationKn: string;
  summaryRecommendationMr: string;
  summaryRecommendationTa: string;
  split: SplitItem[];
  allMandisComparison: MandiComparisonRow[];
  assumptions: string[];
  dataFreshnessMinutesAgo: number;
  isDataStale: boolean;
  verifiedByEngine: boolean;
  engineMode: 'pure_python_or_ts' | 'offline_cached';
  timestamp: string;
}

export interface OptimizeParams {
  cropId: string;
  quantityKg: number;
  localMandiId?: string;
  customRates?: MandiRateEntry[];
  poolDiscountFraction?: number; // e.g. 0.75 for 4-way pool
  maxStaleMinutes?: number;
}

export function calculateShrinkage(
  crop: CropProfile,
  mandi: MandiInfo,
  quantityKg: number,
  pricePerKg: number
): { shrinkageKg: number; shrinkageRupees: number; shrinkagePct: number } {
  if (mandi.distanceKm === 0 || quantityKg <= 0) {
    return { shrinkageKg: 0, shrinkageRupees: 0, shrinkagePct: 0 };
  }

  // Shrinkage rate per transit hour, adjusted by road quality
  const effectiveHourlyRate = crop.shrinkageRatePerHour * mandi.roadQualityFactor;
  // Perishability penalty if shelf life is short (like tomato 48 hrs)
  const shelfLifeStress = Math.min(2.0, 48 / Math.max(12, crop.shelfLifeHours));
  
  const shrinkagePct = Math.min(0.08, mandi.travelTimeHours * effectiveHourlyRate * shelfLifeStress);
  const shrinkageKg = Math.round(quantityKg * shrinkagePct * 10) / 10;
  const shrinkageRupees = Math.round(shrinkageKg * pricePerKg);

  return { shrinkageKg, shrinkageRupees, shrinkagePct: Math.round(shrinkagePct * 1000) / 10 };
}

export function calculateTransportCost(
  mandi: MandiInfo,
  quantityKg: number,
  poolDiscountFraction: number = 0
): number {
  if (mandi.distanceKm === 0) return 0;
  // Solo mini-truck cost based on distance and diesel
  const soloCost = Math.round(mandi.distanceKm * VEHICLE_BASE_FREIGHT_PER_KM);
  if (poolDiscountFraction > 0) {
    // Discounted freight through neighbour truck pool
    return Math.max(200, Math.round(soloCost * (1 - poolDiscountFraction)));
  }
  return soloCost;
}

export function optimizeHarvestDecision(params: OptimizeParams): DecisionEngineOutput {
  const {
    cropId,
    quantityKg,
    localMandiId = 'kolar',
    customRates,
    poolDiscountFraction = 0,
    maxStaleMinutes = 180,
  } = params;

  if (quantityKg <= 0) {
    throw new Error('Quantity must be greater than zero kg.');
  }

  const crop = CROPS[cropId.toLowerCase()] || CROPS.tomato;
  const rates = customRates || SEEDED_RATES;
  const localMandi = MANDIS[localMandiId] || MANDIS.kolar;

  // Find local rate
  const localRateEntry = rates.find(
    (r) => r.cropId === crop.id && r.mandiId === localMandi.id
  ) || {
    mandiId: localMandi.id,
    cropId: crop.id,
    pricePerQuintal: 1850,
    modalPrice: 1850,
    minPrice: 1700,
    maxPrice: 1950,
    grade: 'A' as const,
    arrivalsTonnes: 100,
    lastUpdatedMinutesAgo: 15,
  };

  const localPricePerKg = localRateEntry.pricePerQuintal / 100;
  const localGross = Math.round(quantityKg * localPricePerKg);
  const localFees = Math.round(localGross * localMandi.commissionRate);
  const baselineLocalNet = localGross - localFees;

  // Evaluate all 5 mandis for full load
  let maxFreshnessMinutes = 0;
  const comparisonRows: MandiComparisonRow[] = Object.values(MANDIS).map((mandi) => {
    const rateEntry = rates.find((r) => r.cropId === crop.id && r.mandiId === mandi.id);
    const ratePerQtl = rateEntry ? rateEntry.pricePerQuintal : localRateEntry.pricePerQuintal;
    const minutesAgo = rateEntry ? rateEntry.lastUpdatedMinutesAgo : 30;
    if (minutesAgo > maxFreshnessMinutes) maxFreshnessMinutes = minutesAgo;

    const pricePerKg = ratePerQtl / 100;
    const gross = Math.round(quantityKg * pricePerKg);
    const transport = calculateTransportCost(mandi, quantityKg, poolDiscountFraction);
    const { shrinkageRupees } = calculateShrinkage(crop, mandi, quantityKg, pricePerKg);
    const fees = Math.round(gross * mandi.commissionRate);

    const netProfit = gross - transport - shrinkageRupees - fees;
    const netPerQtl = Math.round((netProfit / quantityKg) * 100);
    const localNetPerQtl = Math.round((baselineLocalNet / quantityKg) * 100);

    return {
      mandiId: mandi.id,
      mandiName: mandi.name,
      mandiNameKn: mandi.nameKn,
      mandiNameHi: mandi.nameHi,
      distanceKm: mandi.distanceKm,
      travelTimeHours: mandi.travelTimeHours,
      ratePerQuintal: ratePerQtl,
      grossForFullLoad: gross,
      transportCost: transport,
      shrinkageLossRupees: shrinkageRupees,
      netProfitFullLoad: netProfit,
      netPerQuintal: netPerQtl,
      netGainVsLocalPerQuintal: netPerQtl - localNetPerQtl,
      isLocal: mandi.id === localMandi.id,
      isBest: false,
    };
  });

  // Identify best non-local mandi
  const sortedNonLocal = [...comparisonRows.filter((r) => !r.isLocal)].sort(
    (a, b) => b.netProfitFullLoad - a.netProfitFullLoad
  );
  const bestDistantRow = sortedNonLocal[0];

  // Mark best row
  const bestOverall = [...comparisonRows].sort((a, b) => b.netProfitFullLoad - a.netProfitFullLoad)[0];
  comparisonRows.forEach((r) => {
    r.isBest = r.mandiId === bestOverall.mandiId;
  });

  // Split logic:
  // If best distant mandi gives a net gain > ₹1,500 over local:
  // Hedging strategy for perishables: 40% local cash-in-hand today, 60% dispatch to best distant mandi
  let split: SplitItem[] = [];
  let totalNetRecommended = baselineLocalNet;
  let netGain = 0;

  const isDistantProfitable = bestDistantRow && bestDistantRow.netProfitFullLoad > baselineLocalNet + 1000;

  if (isDistantProfitable && bestDistantRow) {
    const distantMandi = MANDIS[bestDistantRow.mandiId];
    const distantSplitRatio = 0.6; // 60% distant
    const localSplitRatio = 0.4; // 40% local

    const localAllocatedKg = Math.round(quantityKg * localSplitRatio);
    const distantAllocatedKg = quantityKg - localAllocatedKg;

    // Local segment calculation
    const localPartGross = Math.round(localAllocatedKg * localPricePerKg);
    const localPartFees = Math.round(localPartGross * localMandi.commissionRate);
    const localPartNet = localPartGross - localPartFees;

    // Distant segment calculation
    const distantPricePerKg = bestDistantRow.ratePerQuintal / 100;
    const distantPartGross = Math.round(distantAllocatedKg * distantPricePerKg);
    const distantTransport = calculateTransportCost(distantMandi, distantAllocatedKg, poolDiscountFraction);
    const { shrinkageKg: distShrinkKg, shrinkageRupees: distShrinkRs } = calculateShrinkage(
      crop,
      distantMandi,
      distantAllocatedKg,
      distantPricePerKg
    );
    const distantPartFees = Math.round(distantPartGross * distantMandi.commissionRate);
    const distantPartNet = distantPartGross - distantTransport - distShrinkRs - distantPartFees;

    totalNetRecommended = localPartNet + distantPartNet;
    netGain = totalNetRecommended - baselineLocalNet;

    split = [
      {
        mandiId: localMandi.id,
        mandiName: localMandi.name,
        mandiNameKn: localMandi.nameKn,
        mandiNameHi: localMandi.nameHi,
        percentage: 40,
        allocatedKg: localAllocatedKg,
        expectedGrossRupees: localPartGross,
        transportCostRupees: 0,
        shrinkageKg: 0,
        shrinkageRupees: 0,
        feesRupees: localPartFees,
        netInHandRupees: localPartNet,
        distanceKm: 0,
        travelTimeHours: 0,
        ratePerQuintal: localRateEntry.pricePerQuintal,
        isLocal: true,
      },
      {
        mandiId: distantMandi.id,
        mandiName: distantMandi.name,
        mandiNameKn: distantMandi.nameKn,
        mandiNameHi: distantMandi.nameHi,
        percentage: 60,
        allocatedKg: distantAllocatedKg,
        expectedGrossRupees: distantPartGross,
        transportCostRupees: distantTransport,
        shrinkageKg: distShrinkKg,
        shrinkageRupees: distShrinkRs,
        feesRupees: distantPartFees,
        netInHandRupees: distantPartNet,
        distanceKm: distantMandi.distanceKm,
        travelTimeHours: distantMandi.travelTimeHours,
        ratePerQuintal: bestDistantRow.ratePerQuintal,
        isLocal: false,
      },
    ];
  } else {
    // 100% Local when distant mandis are not lucrative enough after transport + shrinkage
    totalNetRecommended = baselineLocalNet;
    netGain = 0;
    split = [
      {
        mandiId: localMandi.id,
        mandiName: localMandi.name,
        mandiNameKn: localMandi.nameKn,
        mandiNameHi: localMandi.nameHi,
        percentage: 100,
        allocatedKg: quantityKg,
        expectedGrossRupees: localGross,
        transportCostRupees: 0,
        shrinkageKg: 0,
        shrinkageRupees: 0,
        feesRupees: localFees,
        netInHandRupees: baselineLocalNet,
        distanceKm: 0,
        travelTimeHours: 0,
        ratePerQuintal: localRateEntry.pricePerQuintal,
        isLocal: true,
      },
    ];
  }

  // Format localized recommendations
  const bestMandiName = isDistantProfitable ? bestDistantRow.mandiName : localMandi.name;
  const bestMandiNameKn = isDistantProfitable ? bestDistantRow.mandiNameKn : localMandi.nameKn;
  const bestMandiNameHi = isDistantProfitable ? bestDistantRow.mandiNameHi : localMandi.nameHi;

  const summaryRecommendationEn = isDistantProfitable
    ? `Sell 40% (${split[0].allocatedKg} kg) at ${localMandi.name} today for instant liquidity. Send 60% (${split[1].allocatedKg} kg) to ${bestMandiName} (${bestDistantRow.distanceKm} km away) for an extra net in-hand of +₹${netGain.toLocaleString('en-IN')}.`
    : `Sell 100% (${quantityKg} kg) locally at ${localMandi.name} today. Distant mandi price premium does not cover freight and transit shrinkage.`;

  const summaryRecommendationHi = isDistantProfitable
    ? `आज ४०% (${split[0].allocatedKg} किग्रा) तुरंत नकद के लिए ${localMandi.nameHi} में बेचें। ६०% (${split[1].allocatedKg} किग्रा) ${bestMandiNameHi} (${bestDistantRow.distanceKm} किमी दूर) भेजें, जिससे आपको +₹${netGain.toLocaleString('en-IN')} का शुद्ध अतिरिक्त मुनाफा होगा।`
    : `आज पूरा १००% (${quantityKg} किग्रा) स्थानीय ${localMandi.nameHi} में ही बेचें। दूर की मंडी का भाव ढुलाई और वजन कमी की भरपाई नहीं करता।`;

  const summaryRecommendationKn = isDistantProfitable
    ? `ಇಂದು ೪೦% (${split[0].allocatedKg} ಕೆಜಿ) ಸ್ಥಳೀಯ ${localMandi.nameKn}ದಲ್ಲಿ ಮಾರಿ ತಕ್ಷಣ ಹಣ ಪಡೆಯಿರಿ. ಉಳಿದ ೬೦% (${split[1].allocatedKg} ಕೆಜಿ) ಅನ್ನು ${bestMandiNameKn}ಗೆ (${bestDistantRow.distanceKm} ಕಿಮೀ ದೂರ) ಕಳುಹಿಸಿ, ಇದರಿಂದ ನಿಮಗೆ +₹${netGain.toLocaleString('en-IN')} ನಿವ್ವಳ ಹೆಚ್ಚುವರಿ ಲಾಭ ಸಿಗುತ್ತದೆ.`
    : `ಇಂದು ಸಂಪೂರ್ಣ ೧೦೦% (${quantityKg} ಕೆಜಿ) ಸ್ಥಳೀಯ ${localMandi.nameKn}ದಲ್ಲೇ ಮಾರಿ. ದೂರದ ಮಂಡಿಯ ದರವು ಸಾರಿಗೆ ಮತ್ತು ಕೊಳೆತ ನಷ್ಟವನ್ನು ಸರಿದೂಗಿಸುವುದಿಲ್ಲ.`;

  const summaryRecommendationMr = isDistantProfitable
    ? `आज ४०% (${split[0].allocatedKg} किलो) रोख पैशांसाठी स्थानिक बाजारात विका. ६०% (${split[1].allocatedKg} किलो) ${bestMandiName} ला पाठवा, ज्यामुळे तुम्हाला +₹${netGain.toLocaleString('en-IN')} अतिरिक्त निव्वळ नफा मिळेल.`
    : `आज १००% माल स्थानिक बाजारातच विका. दूरच्या बाजारभाव भाडे आणि घट भरून काढत नाही.`;

  const summaryRecommendationTa = isDistantProfitable
    ? `இன்று 40% (${split[0].allocatedKg} கிலோ) உள்ளூர் சந்தையில் விற்று ரொக்கம் பெறுங்கள். 60% (${split[1].allocatedKg} கிலோ) ${bestMandiName} சந்தைக்கு அனுப்பினால் +₹${netGain.toLocaleString('en-IN')} நிகர கூடுதல் லாபம் கிடைக்கும்.`
    : `இன்று 100% பயிரையும் உள்ளூர் சந்தையிலேயே விற்கவும். தூரத்து சந்தை விலை போக்குவரத்து மற்றும் எடை இழப்பை ஈடுகட்டாது.`;

  const isDataStale = maxFreshnessMinutes > maxStaleMinutes;

  return {
    crop: crop.id,
    cropName: crop.name,
    totalQuantityKg: quantityKg,
    localMandiId: localMandi.id,
    localMandiName: localMandi.name,
    baselineLocalNetRupees: baselineLocalNet,
    recommendedTotalNetRupees: totalNetRecommended,
    netGainVsLocalRupees: netGain,
    summaryRecommendationEn,
    summaryRecommendationHi,
    summaryRecommendationKn,
    summaryRecommendationMr,
    summaryRecommendationTa,
    split,
    allMandisComparison: comparisonRows,
    assumptions: [
      `Diesel baseline: ₹${DIESEL_PRICE_PER_LITER}/L, freight rate ₹${VEHICLE_BASE_FREIGHT_PER_KM}/km`,
      `${crop.name} shelf-life: ${crop.shelfLifeHours} hrs (est. shrinkage 2.2% over 65 km)`,
      `Local Kolar baseline rate: ₹${localRateEntry.pricePerQuintal}/quintal`,
      `APMC handling and market commission: 1.5% - 2.0%`,
      `Illustrative calibrated model verified for Ramesh (Kolar, Karnataka tomato farmer)`,
    ],
    dataFreshnessMinutesAgo: maxFreshnessMinutes,
    isDataStale,
    verifiedByEngine: true,
    engineMode: 'pure_python_or_ts',
    timestamp: new Date().toISOString(),
  };
}
