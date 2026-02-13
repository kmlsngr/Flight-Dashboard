// constants.ts: Mock data generators and shared options for the dashboard.

import { 
  FlightRecord, 
  DetailedFlightRecord,
  AppUsageRecord,
  PassengerAnalysisRecord,
  Bolge, 
  UcusSahasi, 
  UcusTipi, 
  KabinTipi, 
  UyelikTipi, 
  LoginTipi, 
  PaketTuru,
  InternetKullanimDagilimi,
  AppType,
  OdemeYontemi,
  BasarisizOlmaNedeni,
  PaketAtamaDurumu,
  UserSegment,
  ConnectionStatus,
  PurchaseStatus
} from './types';

const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = <T,>(arr: T[], count: number): T[] => arr.sort(() => 0.5 - Math.random()).slice(0, count);

const generateDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

const TAIL_NUMBERS = ['TC-JJE', 'TC-LPB', 'TC-LKA', 'TC-JDN', 'TC-JJZ', 'TC-LNC', 'TC-JNM'];
const MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const ORIGINS = ['IST', 'ESB', 'ADB', 'LHR', 'JFK', 'DXB', 'NRT'];
const DESTINATIONS = ['CDG', 'FRA', 'AMS', 'MUC', 'BKK', 'SIN', 'LAX'];

export const MOCK_DATA: FlightRecord[] = Array.from({ length: 400 }).map((_, i) => {
  const dateStr = generateDate(new Date('2025-01-01'), new Date('2025-12-31'));
  const dateObj = new Date(dateStr);
  const monthName = MONTHS_TR[dateObj.getMonth()];
  
  const bolge = getRandom(Object.values(Bolge));
  const ucusTipi = getRandom(Object.values(UcusTipi));
  const ucusSahasi = bolge === Bolge.TURKIYE ? UcusSahasi.YURTICI : UcusSahasi.YURTDISI;
  const baglananYolcu = Math.floor(50 + Math.random() * 150);

  const basariliSatinAlim = Math.floor(Math.random() * 30) + 10;
  const hataliSatinAlim = Math.floor(Math.random() * 5);
  const basariliPaketAtama = Math.floor(basariliSatinAlim * 0.95);
  const hataliPaketAtama = basariliSatinAlim - basariliPaketAtama;

  return {
    id: `GEN-${10000 + i}`,
    tarih: dateStr,
    bolge,
    kuyrukNumarasi: getRandom(TAIL_NUMBERS),
    ucusSahasi,
    ucusTipi,
    kabinTipi: getRandom(Object.values(KabinTipi)),
    baglananYolcuSayisi: baglananYolcu,
    uyelikTipi: getRandom(Object.values(UyelikTipi)),
    loginTipi: getRandom(Object.values(LoginTipi)),
    internetKullanimDagilimi: getRandom(Object.values(InternetKullanimDagilimi)),
    satinAlinanPaketTuru: getRandom(Object.values(PaketTuru)),
    aylikOrtKirilim: `${monthName} 2025`,
    basariliSatinAlimSayisi: basariliSatinAlim,
    hataliSatinAlimSayisi: hataliSatinAlim,
    basariliPaketAtamaSayisi: basariliPaketAtama,
    hataliPaketAtamaSayisi: hataliPaketAtama
  };
});

// PAGE 2 MOCK DATA
export const MOCK_DETAILED_DATA: DetailedFlightRecord[] = Array.from({ length: 1000 }).map((_, i) => {
  const dateStr = generateDate(new Date('2025-01-01'), new Date('2025-12-31'));
  const bolge = getRandom(Object.values(Bolge));
  const failed = Math.random() < 0.1;
  const assignmentStatus = failed ? PaketAtamaDurumu.FAILED : PaketAtamaDurumu.SUCCESS;
  const hour = (i % 10) + 1;
  const connectedPax = Math.floor(Math.random() * 50);
  
  let usageAmountMB = failed ? 0 : Math.floor(Math.random() * 500);

  return {
    id: `DET-${i}`,
    flightId: `TK${1000 + Math.floor(i / 10)}`,
    timeHour: hour,
    tarih: dateStr,
    kuyrukNumarasi: getRandom(TAIL_NUMBERS),
    ucusNumarasi: `TK${1000 + Math.floor(i / 10)}`,
    origin: getRandom(ORIGINS),
    destination: getRandom(DESTINATIONS),
    bolge,
    routeType: bolge === Bolge.TURKIYE ? UcusSahasi.YURTICI : UcusSahasi.YURTDISI,
    flightType: getRandom(Object.values(UcusTipi)),
    connectedPax,
    disconnectedPax: Math.floor(connectedPax * 0.1),
    connectedDevices: Math.floor(connectedPax * 1.2),
    disconnectedDevices: Math.floor(connectedPax * 0.15),
    internetStartPax: Math.floor(Math.random() * 10),
    internetEndPax: Math.floor(Math.random() * 5),
    usageAmountMB,
    loginType: getRandom(Object.values(LoginTipi)),
    membershipType: getRandom(Object.values(UyelikTipi)),
    appUsage: {},
    hasDpiData: !failed,
    successfulPurchases: failed ? 0 : Math.floor(Math.random() * 5),
    failedPurchases: failed ? 1 : 0,
    failureReason: failed ? getRandom(Object.values(BasarisizOlmaNedeni).filter(r => r !== BasarisizOlmaNedeni.NONE)) : BasarisizOlmaNedeni.NONE,
    paymentMethod: getRandom(Object.values(OdemeYontemi)),
    purchasedPackage: getRandom(Object.values(PaketTuru)),
    packageName: `${getRandom(Object.values(PaketTuru))} 1GB`,
    packageAssignmentStatus: assignmentStatus,
    failedAssignmentReason: failed ? "Sistem yanıt vermedi" : "",
    packageUsageMB: usageAmountMB
  };
});

// PAGE 3 MOCK DATA
export const MOCK_APP_USAGE_DATA: AppUsageRecord[] = Array.from({ length: 3000 }).map((_, i) => {
  const dateStr = generateDate(new Date('2025-01-01'), new Date('2025-12-31'));
  const bolge = getRandom(Object.values(Bolge));
  const pax = Math.floor(Math.random() * 20) + 1;
  return {
    id: `APP-${i}`,
    timeHour: Math.floor(Math.random() * 12) + 1,
    flightId: `TK${1000 + Math.floor(Math.random() * 100)}`,
    kuyrukNumarasi: getRandom(TAIL_NUMBERS),
    ucusNumarasi: `TK${1000 + Math.floor(Math.random() * 100)}`,
    tarih: dateStr,
    origin: getRandom(ORIGINS),
    destination: getRandom(DESTINATIONS),
    bolge,
    ucusSahasi: bolge === Bolge.TURKIYE ? UcusSahasi.YURTICI : UcusSahasi.YURTDISI,
    ucusTipi: getRandom(Object.values(UcusTipi)),
    uygulamaTuru: getRandom(Object.values(AppType)),
    yolcuSayisi: pax,
    kullanimMiktariMB: Math.floor(Math.random() * 150 * pax)
  };
});

// PAGE 4 MOCK DATA (Passenger Analysis - 30+ Fields)
const NAMES = ['Kubra', 'Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'John', 'Jane', 'Michael', 'Sarah'];
const SURNAMES = ['Cosar', 'Yılmaz', 'Demir', 'Kaya', 'Çelik', 'Doe', 'Smith', 'Johnson', 'Müller'];
const NATIONALITIES = ['TUR', 'USA', 'GER', 'GBR', 'FRA', 'ITA'];

export const MOCK_PASSENGER_DATA: PassengerAnalysisRecord[] = Array.from({ length: 400 }).map((_, i) => {
  const dateStr = generateDate(new Date('2025-01-01'), new Date('2025-12-31'));
  const flightId = `TK${1000 + (i % 20)}`;
  const origin = getRandom(ORIGINS);
  const destination = getRandom(DESTINATIONS);
  const userName = `TK_${(1000 + i).toString().padStart(4, '0')}_${dateStr}_${origin}_${destination}_${1000000000000 + i}`;
  const hour = (i % 12) + 1;
  
  const connectionStatus = Math.random() > 0.1 ? ConnectionStatus.SUCCESS : ConnectionStatus.FAILED;
  const isPaying = Math.random() > 0.4;
  const purchaseStatus = isPaying ? (Math.random() > 0.15 ? PurchaseStatus.SUCCESS : PurchaseStatus.FAILED) : PurchaseStatus.NONE;
  
  // LOGIC FIX: Satınalım veya bağlantı başarısızsa kullanım 0 olmalı
  let dataUsageMB = 0;
  let usedAppName: AppType | 'N/A' = 'N/A';
  if (connectionStatus === ConnectionStatus.SUCCESS && purchaseStatus === PurchaseStatus.SUCCESS) {
      dataUsageMB = Math.floor(Math.random() * 800) + 10;
      usedAppName = getRandom(Object.values(AppType));
  } else if (connectionStatus === ConnectionStatus.SUCCESS && purchaseStatus === PurchaseStatus.NONE) {
      // Ücretsiz hak kullanımı gibi bir senaryo için küçük bir ihtimal
      dataUsageMB = Math.random() > 0.7 ? Math.floor(Math.random() * 50) : 0;
      usedAppName = dataUsageMB > 0 ? getRandom(Object.values(AppType)) : 'N/A';
  }

  const loginCount = Math.floor(Math.random() * 4) + 1;
  const sessionCount = Math.floor(Math.random() * 3) + 1;

  return {
    id: `PAX-${i}`,
    timeHour: hour,
    userName,
    name: getRandom(NAMES),
    surname: getRandom(SURNAMES),
    ip: `10.128.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    mac: `C2:DB:20:BA:F3:${(i % 255).toString(16).toUpperCase().padStart(2, '0')}`,
    nationality: getRandom(NATIONALITIES),
    passportNumber: `A${Math.floor(10000000 + Math.random() * 90000000)}`,
    identityNumber: `${10000000000 + Math.floor(Math.random() * 89999999999)}`,
    flightId: flightId,
    kuyrukNumarasi: getRandom(TAIL_NUMBERS),
    ucusNumarasi: flightId,
    ucusTarihi: dateStr,
    origin,
    destination,
    kabinTipi: getRandom(Object.values(KabinTipi)),
    userSegment: getRandom(Object.values(UserSegment)),
    ucusSahasi: getRandom(Object.values(UcusSahasi)),
    ucusTipi: getRandom(Object.values(UcusTipi)),
    sessionStart: `${10+hour}:00`,
    sessionEnd: `${10+hour}:45`,
    connectionStatus,
    internetUsageStart: dataUsageMB > 0 ? `${10+hour}:05` : '-',
    internetUsageEnd: dataUsageMB > 0 ? `${10+hour}:40` : '-',
    purchaseStatus,
    failedPurchaseReason: purchaseStatus === PurchaseStatus.FAILED ? getRandom(Object.values(BasarisizOlmaNedeni).filter(r => r !== BasarisizOlmaNedeni.NONE)) : BasarisizOlmaNedeni.NONE,
    paymentMethod: purchaseStatus === PurchaseStatus.SUCCESS ? getRandom(Object.values(OdemeYontemi).filter(v => v !== OdemeYontemi.NA)) : OdemeYontemi.NA,
    usedPackageName: purchaseStatus === PurchaseStatus.SUCCESS ? "Messaging 100MB" : "N/A",
    packageStartTime: purchaseStatus === PurchaseStatus.SUCCESS ? `${10+hour}:05` : '-',
    dataUsageMB,
    usedAppName,
    sessionCount,
    internetUsageStatus: dataUsageMB > 0 ? `${Math.floor(Math.random() * 5) + 1}` : '0',
    loginCount,
    failedPurchaseCount: purchaseStatus === PurchaseStatus.FAILED ? 1 : 0
  };
});

export const OPTIONS = {
  BOLGE: Object.values(Bolge),
  UCUS_SAHASI: Object.values(UcusSahasi),
  UCUS_TIPI: Object.values(UcusTipi),
  KABIN_TIPI: Object.values(KabinTipi),
  KUYRUK: TAIL_NUMBERS,
  UYELIK: Object.values(UyelikTipi),
  LOGIN: Object.values(LoginTipi),
  PAKET: Object.values(PaketTuru),
  AYLAR: MONTHS_TR.map(m => `${m} 2025`),
  ORIGINS,
  DESTINATIONS,
  APP_TYPES: Object.values(AppType),
  PAYMENT_METHODS: Object.values(OdemeYontemi),
  FAILURE_REASONS: Object.values(BasarisizOlmaNedeni),
  ASSIGNMENT_STATUS: Object.values(PaketAtamaDurumu),
  USER_SEGMENTS: Object.values(UserSegment),
  CONNECTION_STATUS: Object.values(ConnectionStatus),
  PURCHASE_STATUS: Object.values(PurchaseStatus),
  USER_NAMES: Array.from(new Set(MOCK_PASSENGER_DATA.map(d => d.userName))).sort(),
  FLIGHT_IDS: Array.from(new Set(MOCK_DETAILED_DATA.map(d => d.flightId))).sort(),
  HOURS: Array.from(new Set(MOCK_DETAILED_DATA.map(d => d.timeHour))).sort((a,b) => a-b)
};
