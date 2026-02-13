
// types.ts: Define application types and interfaces for data models and filter states.

export enum Bolge {
  AVRUPA = 'Avrupa',
  AFRIKA = 'Afrika',
  AMERIKA = 'Amerika',
  UZAKDOGU = 'Uzakdoğu',
  ORTADOGU = 'Ortadoğu',
  TURKIYE = 'Türkiye'
}

export enum UcusSahasi {
  YURTICI = 'Yurtiçi',
  YURTDISI = 'Yurtdışı'
}

export enum UcusTipi {
  LONG = 'Long',
  SHORT = 'Short'
}

export enum KabinTipi {
  BUSINESS = 'Business',
  EKONOMI = 'Ekonomi'
}

export enum UyelikTipi {
  CLSC = 'CLSC',
  CLPL = 'CLPL',
  ELIT = 'ELIT',
  ELPL = 'ELPL',
  NA = 'N/A'
}

export enum LoginTipi {
  NORMAL = 'Normal Login',
  PROMO = 'Promotion Code',
  SCRATCH = 'Scratch Code'
}

export enum PaketTuru {
  MESSAGING = 'Messaging',
  SURF = 'Surf',
  STREAM = 'Stream',
  UNLIMITED = 'Unlimited'
}

export enum InternetKullanimDagilimi {
  DUSUK = 'Düşük (<10MB)',
  ORTA = 'Orta (10-100MB)',
  YUKSEK = 'Yüksek (>100MB)'
}

export enum AppType {
  INSTAGRAM = 'Instagram',
  WHATSAPP = 'WhatsApp',
  YOUTUBE = 'YouTube',
  NETFLIX = 'Netflix',
  TIKTOK = 'TikTok',
  OTHER = 'Diğer',
  UNKNOWN = 'Bilinmiyor'
}

export enum OdemeYontemi {
  CREDIT_CARD = 'Kredi Kartı',
  MILES = 'Miller',
  VOUCHER = 'Voucher',
  DEBIT_CARD = 'Debit Kart',
  DIGER = 'Diğer',
  NA = 'N/A'
}

export enum BasarisizOlmaNedeni {
  INSUFFICIENT_FUNDS = 'Yetersiz Bakiye',
  TIMEOUT = 'Zaman Aşımı',
  SYSTEM_ERROR = 'Sistem Hatası',
  INVALID_CARD = 'Geçersiz Kart',
  NONE = 'Yok'
}

export enum PaketAtamaDurumu {
  SUCCESS = 'Başarılı',
  FAILED = 'Başarısız',
  PENDING = 'Bekliyor'
}

export enum UserSegment {
  CLSC = 'CLSC',
  CLPL = 'CLPL',
  ELIT = 'ELIT',
  ELPL = 'ELPL',
  PC = 'PC',
  SC = 'SC',
  BC = 'BC',
  EC = 'EC'
}

export enum ConnectionStatus {
  SUCCESS = 'Başarılı',
  FAILED = 'Başarısız'
}

export enum PurchaseStatus {
  SUCCESS = 'Başarılı',
  FAILED = 'Başarısız',
  NONE = 'Yok'
}

// Added FlightRecord interface for Page 1 data
export interface FlightRecord {
  id: string;
  tarih: string;
  bolge: Bolge;
  kuyrukNumarasi: string;
  ucusSahasi: UcusSahasi;
  ucusTipi: UcusTipi;
  kabinTipi: KabinTipi;
  baglananYolcuSayisi: number;
  uyelikTipi: UyelikTipi;
  loginTipi: LoginTipi;
  internetKullanimDagilimi: InternetKullanimDagilimi;
  satinAlinanPaketTuru: PaketTuru;
  aylikOrtKirilim: string;
  basariliSatinAlimSayisi: number;
  hataliSatinAlimSayisi: number;
  basariliPaketAtamaSayisi: number;
  hataliPaketAtamaSayisi: number;
}

// Added AppUsageRecord interface for Page 3 data
export interface AppUsageRecord {
  id: string;
  timeHour: number;
  tarih: string;
  flightId: string;
  kuyrukNumarasi: string;
  ucusNumarasi: string;
  origin: string;
  destination: string;
  bolge: Bolge;
  ucusSahasi: UcusSahasi;
  ucusTipi: UcusTipi;
  uygulamaTuru: AppType;
  yolcuSayisi: number;
  kullanimMiktariMB: number;
}

// PAGE 2 Data Model (Detailed)
export interface DetailedFlightRecord {
  id: string;
  flightId: string;
  timeHour: number;
  tarih: string;
  kuyrukNumarasi: string;
  ucusNumarasi: string;
  origin: string;
  destination: string;
  bolge: Bolge;
  routeType: UcusSahasi;
  flightType: UcusTipi;
  connectedPax: number;
  disconnectedPax: number;
  connectedDevices: number;
  disconnectedDevices: number;
  usageAmountMB: number;
  membershipType: UyelikTipi;
  // Added loginType to support Page 2 filtering
  loginType: LoginTipi;
  
  // SATIN ALIM VERİLERİ (Source: Satın Alım Verisi)
  purchaseStatus: PurchaseStatus;
  successfulPurchases: number;
  failedPurchases: number;
  failureReason: BasarisizOlmaNedeni;
  paymentMethod: OdemeYontemi;

  // PAKET ATAMA VERİLERİ (Source: Paket Atama)
  packageName: string;
  purchasedPackage: PaketTuru;
  packageAssignmentStatus: PaketAtamaDurumu;
  failedAssignmentReason: string;
  packageUsageMB: number;
}

// PAGE 4 Data Model
export interface PassengerAnalysisRecord {
  id: string;
  timeHour: number;
  userName: string;
  name: string;
  surname: string;
  ip: string;
  mac: string;
  flightId: string;
  kuyrukNumarasi: string;
  ucusNumarasi: string;
  ucusTarihi: string;
  origin: string;
  destination: string;
  kabinTipi: KabinTipi;
  userSegment: UserSegment;
  ucusSahasi: UcusSahasi;
  ucusTipi: UcusTipi;
  connectionStatus: ConnectionStatus;
  
  // SATIN ALIM VERİLERİ
  purchaseStatus: PurchaseStatus;
  failedPurchaseReason: BasarisizOlmaNedeni;
  paymentMethod: OdemeYontemi;
  failedPurchaseCount: number;

  // PAKET ATAMA VERİLERİ
  usedPackageName: string;
  packageAssignmentStatus: PaketAtamaDurumu;
  dataUsageMB: number;
  usedAppName: AppType | 'N/A';
  sessionCount: number;
  internetUsageStatus: string;
  loginCount: number;
}

// Filter States
export interface GeneralFilterState {
  startDate: string;
  endDate: string;
  bolge: Bolge[];
  kuyrukNumarasi: string[];
  ucusSahasi: UcusSahasi[];
  ucusTipi: UcusTipi | null;
  kabinTipi: KabinTipi[];
  uyelikTipi: UyelikTipi[];
  loginTipi: LoginTipi[];
  satinAlinanPaketTuru: PaketTuru[];
}

// Added FilterState interface to support old/generic FilterBar component
export interface FilterState extends GeneralFilterState {
  minBaglananYolcu: number;
  maxBaglananYolcu: number;
}

export interface DetailedFilterState {
  startDate: string;
  endDate: string;
  timeHour: number | null;
  flightId: string;
  kuyrukNumarasi: string[];
  ucusNumarasi: string;
  origin: string[];
  destination: string[];
  bolge: Bolge[];
  routeType: UcusSahasi[];
  flightType: UcusTipi | null;
  loginType: LoginTipi[];
  membershipType: UyelikTipi[];
  appType: AppType[];
  paymentMethod: OdemeYontemi[];
  purchasedPackage: PaketTuru[];
  packageAssignmentStatus: PaketAtamaDurumu[];
  failureReason: BasarisizOlmaNedeni[];
}

export interface AppUsageFilterState {
  startDate: string;
  endDate: string;
  timeHour: number | null;
  flightId: string;
  kuyrukNumarasi: string[];
  ucusNumarasi: string;
  origin: string[];
  destination: string[];
  bolge: Bolge[];
  ucusSahasi: UcusSahasi[];
  ucusTipi: UcusTipi | null;
  uygulamaTuru: AppType[];
}

export interface PassengerAnalysisFilterState {
  startDate: string;
  endDate: string;
  timeHour: number | null;
  flightId: string;
  kuyrukNumarasi: string[];
  ucusNumarasi: string;
  origin: string[];
  destination: string[];
  kabinTipi: KabinTipi[];
  userSegment: UserSegment[];
  ucusSahasi: UcusSahasi[];
  ucusTipi: UcusTipi | null;
  connectionStatus: ConnectionStatus[];
  purchaseStatus: PurchaseStatus[];
  paymentMethod: OdemeYontemi[];
  usedPackageName: string[];
  usedAppName: AppType[];
  userName: string[];
}
