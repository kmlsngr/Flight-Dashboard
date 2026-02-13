
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

// PAGE 1 Data Model
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
  internetStartPax: number;
  internetEndPax: number;
  usageAmountMB: number;
  loginType: LoginTipi;
  membershipType: UyelikTipi;
  appUsage: Record<string, number>;
  hasDpiData: boolean;
  successfulPurchases: number;
  failedPurchases: number;
  failureReason: BasarisizOlmaNedeni;
  paymentMethod: OdemeYontemi;
  purchasedPackage: PaketTuru;
  packageName: string;
  packageAssignmentStatus: PaketAtamaDurumu;
  failedAssignmentReason: string;
  packageUsageMB: number;
}

// PAGE 3 Data Model
export interface AppUsageRecord {
  id: string;
  timeHour: number;
  flightId: string;
  kuyrukNumarasi: string;
  ucusNumarasi: string;
  tarih: string;
  origin: string;
  destination: string;
  bolge: Bolge;
  ucusSahasi: UcusSahasi;
  ucusTipi: UcusTipi;
  uygulamaTuru: AppType;
  yolcuSayisi: number;
  kullanimMiktariMB: number;
}

// PAGE 4 Data Model (Comprehensive List as requested)
export interface PassengerAnalysisRecord {
  id: string;
  timeHour: number; // Time (Uçuşun x. saati)
  userName: string; // User Name (TK_0003_...)
  name: string; // Name
  surname: string; // Surname
  ip: string; // IP
  mac: string; // MAC
  nationality: string; // Nationality
  passportNumber: string; // Passport Number
  identityNumber: string; // Identity Number
  flightId: string; // Flight Id
  kuyrukNumarasi: string; // Kuyruk Numarası
  ucusNumarasi: string; // Uçuş Numarası
  ucusTarihi: string; // Uçuş Tarihi
  origin: string; // Origin
  destination: string; // Destination
  kabinTipi: KabinTipi; // Kabin Tipi
  userSegment: UserSegment; // User Segment
  ucusSahasi: UcusSahasi; // Uçuş Sahası
  ucusTipi: UcusTipi; // Uçuş Tipi
  sessionStart: string; // Session Başlangıcı
  sessionEnd: string; // Session Bitişi
  connectionStatus: ConnectionStatus; // İnternet Bağlantı Başarı Durumu
  internetUsageStart: string; // İnternet Kullanımı Başlangıcı
  internetUsageEnd: string; // İnternet Kullanımı Bitişi
  purchaseStatus: PurchaseStatus; // Satınalım Durumu
  failedPurchaseReason: BasarisizOlmaNedeni; // Başarısız Satınalım Nedeni
  paymentMethod: OdemeYontemi; // Ödeme Yöntemi
  usedPackageName: string; // Kullanılan Paket ismi
  packageStartTime: string; // Paketin Kullanıma Başlandığı Zaman
  dataUsageMB: number; // Veri Kullanım Miktarı (DPI)
  usedAppName: AppType | 'N/A'; // Kullanılan Uygulama Adı
  sessionCount: number; // Session Sayısı
  internetUsageStatus: string; // İnternet Kullanım Durumu (Sayısı)
  loginCount: number; // Login Sayısı
  failedPurchaseCount: number; // Başarısız Satınalım Sayısı
}

/**
 * FilterState interface for the generic FilterBar component.
 * Added to resolve the missing export error in components/FilterBar.tsx.
 */
export interface FilterState {
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
  minBaglananYolcu: number;
  maxBaglananYolcu: number;
}

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
