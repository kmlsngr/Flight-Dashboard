
// constants.ts: Mock data generators with logical linkage between Purchase and Assignment.

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
const TAIL_NUMBERS = ['TC-JJE', 'TC-LPB', 'TC-LKA', 'TC-JDN', 'TC-JJZ', 'TC-LNC', 'TC-JNM'];
const ORIGINS = ['IST', 'ESB', 'ADB', 'LHR', 'JFK', 'DXB', 'NRT'];
const DESTINATIONS = ['CDG', 'FRA', 'AMS', 'MUC', 'BKK', 'SIN', 'LAX'];

const generateDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

export const MOCK_DATA: FlightRecord[] = Array.from({ length: 400 }).map((_, i) => {
  const dateStr = generateDate(new Date('2025-01-01'), new Date('2025-12-31'));
  const bolge = getRandom(Object.values(Bolge));
  return {
    id: `GEN-${10000 + i}`,
    tarih: dateStr,
    bolge,
    kuyrukNumarasi: getRandom(TAIL_NUMBERS),
    ucusSahasi: bolge === Bolge.TURKIYE ? UcusSahasi.YURTICI : UcusSahasi.YURTDISI,
    ucusTipi: getRandom(Object.values(UcusTipi)),
    kabinTipi: getRandom(Object.values(KabinTipi)),
    baglananYolcuSayisi: Math.floor(50 + Math.random() * 150),
    uyelikTipi: getRandom(Object.values(UyelikTipi)),
    loginTipi: getRandom(Object.values(LoginTipi)),
    internetKullanimDagilimi: getRandom(Object.values(InternetKullanimDagilimi)),
    satinAlinanPaketTuru: getRandom(Object.values(PaketTuru)),
    aylikOrtKirilim: `${dateStr.split('-')[1]} 2025`,
    basariliSatinAlimSayisi: Math.floor(Math.random() * 30),
    hataliSatinAlimSayisi: Math.floor(Math.random() * 5),
    basariliPaketAtamaSayisi: Math.floor(Math.random() * 25),
    hataliPaketAtamaSayisi: Math.floor(Math.random() * 3)
  };
});

export const MOCK_DETAILED_DATA: DetailedFlightRecord[] = Array.from({ length: 1000 }).map((_, i) => {
  const dateStr = generateDate(new Date('2025-01-01'), new Date('2025-12-31'));
  const purchaseFailed = Math.random() < 0.15;
  const assignmentFailed = !purchaseFailed && Math.random() < 0.05;

  return {
    id: `DET-${i}`,
    flightId: `TK${1000 + Math.floor(i / 10)}`,
    timeHour: (i % 10) + 1,
    tarih: dateStr,
    kuyrukNumarasi: getRandom(TAIL_NUMBERS),
    ucusNumarasi: `TK${1000 + Math.floor(i / 10)}`,
    origin: getRandom(ORIGINS),
    destination: getRandom(DESTINATIONS),
    bolge: getRandom(Object.values(Bolge)),
    routeType: UcusSahasi.YURTDISI,
    flightType: UcusTipi.LONG,
    connectedPax: Math.floor(Math.random() * 100),
    disconnectedPax: Math.floor(Math.random() * 10),
    connectedDevices: Math.floor(Math.random() * 120),
    disconnectedDevices: Math.floor(Math.random() * 5),
    usageAmountMB: purchaseFailed ? 0 : Math.floor(Math.random() * 2000),
    membershipType: getRandom(Object.values(UyelikTipi)),
    // Fixed missing loginType
    loginType: getRandom(Object.values(LoginTipi)),
    
    // Satın Alım Bloğu
    purchaseStatus: purchaseFailed ? PurchaseStatus.FAILED : PurchaseStatus.SUCCESS,
    successfulPurchases: purchaseFailed ? 0 : 1,
    failedPurchases: purchaseFailed ? 1 : 0,
    failureReason: purchaseFailed ? getRandom(Object.values(BasarisizOlmaNedeni).filter(n => n !== BasarisizOlmaNedeni.NONE)) : BasarisizOlmaNedeni.NONE,
    paymentMethod: purchaseFailed ? OdemeYontemi.NA : getRandom(Object.values(OdemeYontemi).filter(m => m !== OdemeYontemi.NA)),

    // Paket Atama Bloğu
    packageName: purchaseFailed ? "N/A" : "Unlimited Streaming",
    purchasedPackage: getRandom(Object.values(PaketTuru)),
    packageAssignmentStatus: purchaseFailed ? PaketAtamaDurumu.FAILED : (assignmentFailed ? PaketAtamaDurumu.FAILED : PaketAtamaDurumu.SUCCESS),
    failedAssignmentReason: assignmentFailed ? "Kuyruk Servis Hatası" : "",
    packageUsageMB: purchaseFailed ? 0 : Math.floor(Math.random() * 1000)
  };
});

// Added MOCK_APP_USAGE_DATA generator
export const MOCK_APP_USAGE_DATA: AppUsageRecord[] = Array.from({ length: 800 }).map((_, i) => {
  const dateStr = generateDate(new Date('2025-01-01'), new Date('2025-12-31'));
  const bolge = getRandom(Object.values(Bolge));
  const flightId = `TK${1000 + Math.floor(i / 8)}`;
  return {
    id: `APP-${i}`,
    timeHour: (i % 12) + 1,
    tarih: dateStr,
    flightId,
    kuyrukNumarasi: getRandom(TAIL_NUMBERS),
    ucusNumarasi: flightId,
    origin: getRandom(ORIGINS),
    destination: getRandom(DESTINATIONS),
    bolge,
    ucusSahasi: bolge === Bolge.TURKIYE ? UcusSahasi.YURTICI : UcusSahasi.YURTDISI,
    ucusTipi: getRandom(Object.values(UcusTipi)),
    uygulamaTuru: getRandom(Object.values(AppType)),
    yolcuSayisi: Math.floor(Math.random() * 50),
    kullanimMiktariMB: Math.floor(Math.random() * 2000)
  };
});

export const MOCK_PASSENGER_DATA: PassengerAnalysisRecord[] = Array.from({ length: 400 }).map((_, i) => {
  const purchaseFailed = Math.random() < 0.1;
  const flightId = `TK${1000 + (i % 20)}`;

  return {
    id: `PAX-${i}`,
    timeHour: (i % 12) + 1,
    userName: `TK_USER_${i.toString().padStart(4, '0')}`,
    name: "Yolcu",
    surname: "Soyadı " + i,
    ip: `192.168.1.${i % 254}`,
    mac: `C2:DB:20:BA:F3:${(i % 255).toString(16).toUpperCase()}`,
    flightId,
    kuyrukNumarasi: getRandom(TAIL_NUMBERS),
    ucusNumarasi: flightId,
    ucusTarihi: '2025-05-15',
    origin: 'IST',
    destination: 'JFK',
    kabinTipi: getRandom(Object.values(KabinTipi)),
    userSegment: getRandom(Object.values(UserSegment)),
    ucusSahasi: UcusSahasi.YURTDISI,
    ucusTipi: UcusTipi.LONG,
    connectionStatus: ConnectionStatus.SUCCESS,

    // Satın Alım Bloğu
    purchaseStatus: purchaseFailed ? PurchaseStatus.FAILED : PurchaseStatus.SUCCESS,
    failedPurchaseReason: purchaseFailed ? getRandom(Object.values(BasarisizOlmaNedeni).filter(n => n !== BasarisizOlmaNedeni.NONE)) : BasarisizOlmaNedeni.NONE,
    paymentMethod: purchaseFailed ? OdemeYontemi.NA : getRandom(Object.values(OdemeYontemi).filter(m => m !== OdemeYontemi.NA)),
    failedPurchaseCount: purchaseFailed ? 1 : 0,

    // Paket Atama Bloğu
    usedPackageName: purchaseFailed ? "N/A" : "Social Media Pack",
    packageAssignmentStatus: purchaseFailed ? PaketAtamaDurumu.FAILED : PaketAtamaDurumu.SUCCESS,
    dataUsageMB: purchaseFailed ? 0 : Math.floor(Math.random() * 500),
    usedAppName: purchaseFailed ? 'N/A' : getRandom(Object.values(AppType)),
    sessionCount: Math.floor(Math.random() * 5),
    internetUsageStatus: purchaseFailed ? "0" : "1",
    loginCount: 1
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
