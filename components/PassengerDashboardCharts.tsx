
import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { PassengerAnalysisRecord, AppType, OdemeYontemi } from '../types';

interface PassengerDashboardChartsProps {
  data: PassengerAnalysisRecord[];
}

const METRIC_COLORS = {
  auth: '#6366f1',      // Indigo
  service: '#10b981',   // Emerald
  error: '#ef4444',     // Rose
  devices: '#3b82f6'    // Blue
};

const APP_COLORS: Record<string, string> = {
  [AppType.INSTAGRAM]: '#E1306C',
  [AppType.WHATSAPP]: '#25D366',
  [AppType.YOUTUBE]: '#FF0000',
  [AppType.NETFLIX]: '#E50914',
  [AppType.TIKTOK]: '#000000',
  [AppType.OTHER]: '#808080',
  [AppType.UNKNOWN]: '#CCCCCC',
  ['N/A']: '#cbd5e1'
};

const PAYMENT_COLORS: Record<string, string> = {
  [OdemeYontemi.CREDIT_CARD]: '#2563eb',
  [OdemeYontemi.MILES]: '#d97706',
  [OdemeYontemi.VOUCHER]: '#059669',
  [OdemeYontemi.DEBIT_CARD]: '#7c3aed',
  [OdemeYontemi.DIGER]: '#64748b',
  [OdemeYontemi.NA]: '#e2e8f0'
};

const PassengerDashboardCharts: React.FC<PassengerDashboardChartsProps> = ({ data }) => {
  const [timelineHour, setTimelineHour] = useState<number>(1);
  
  const maxHour = useMemo(() => {
      if (data.length === 0) return 12;
      return Math.max(...data.map(d => d.timeHour));
  }, [data]);

  useEffect(() => {
     if (timelineHour > maxHour && maxHour > 0) setTimelineHour(maxHour);
  }, [maxHour]);

  const cumulativeData = useMemo(() => {
      return data.filter(d => d.timeHour <= timelineHour);
  }, [data, timelineHour]);

  // GRUP 1: ERİŞİM ANALİZİ (Session & Login)
  const authMetrics = useMemo(() => {
    let session = 0, login = 0;
    cumulativeData.forEach(d => { 
        session += d.sessionCount || 0; 
        login += d.loginCount || 0; 
    });
    return [
        { name: 'Oturumlar', count: session, fill: '#818cf8' },
        { name: 'Girişler', count: login, fill: '#6366f1' }
    ];
  }, [cumulativeData]);

  // GRUP 2: SERVİS ETKİLEŞİMİ (İnternet Kullanım Sayısı)
  const serviceCount = useMemo(() => {
    const total = cumulativeData.reduce((acc, d) => {
        const val = parseInt(d.internetUsageStatus);
        return acc + (isNaN(val) ? 0 : val);
    }, 0);
    return [{ name: 'İnternet Servis Aktivasyonu', value: total }];
  }, [cumulativeData]);

  // GRUP 3: KRİTİK HATA TAKİBİ (Failed Purchase)
  const errorCount = useMemo(() => {
    const total = cumulativeData.reduce((acc, d) => acc + (d.failedPurchaseCount || 0), 0);
    return [{ name: 'Başarısız Satınalım', count: total }];
  }, [cumulativeData]);

  // YENİ: BAĞLI CİHAZ SAYISI
  const uniqueDevicesCount = useMemo(() => {
    return new Set(cumulativeData.map(d => d.mac)).size;
  }, [cumulativeData]);

  // YENİ: PAKET BAZLI MB KULLANIMI
  const packageUsage = useMemo(() => {
    const groups: Record<string, number> = {};
    cumulativeData.forEach(d => {
        if (d.usedPackageName && d.usedPackageName !== 'N/A') {
            groups[d.usedPackageName] = (groups[d.usedPackageName] || 0) + (d.dataUsageMB || 0);
        }
    });
    return Object.entries(groups)
        .map(([name, value]) => ({ name, value }))
        .sort((a,b) => b.value - a.value);
  }, [cumulativeData]);

  // YENİ: UYGULAMA BAZLI MB KULLANIMI
  const appUsage = useMemo(() => {
    const groups: Record<string, number> = {};
    cumulativeData.forEach(d => {
        if (d.usedAppName && d.usedAppName !== 'N/A') {
            groups[d.usedAppName] = (groups[d.usedAppName] || 0) + (d.dataUsageMB || 0);
        }
    });
    return Object.entries(groups)
        .map(([name, value]) => ({ name, value }))
        .sort((a,b) => b.value - a.value);
  }, [cumulativeData]);

  // YENİ: ÖDEME YÖNTEMİ DAĞILIMI
  const paymentDistribution = useMemo(() => {
    const groups: Record<string, number> = {};
    cumulativeData.forEach(d => {
        if (d.paymentMethod && d.paymentMethod !== OdemeYontemi.NA) {
            groups[d.paymentMethod] = (groups[d.paymentMethod] || 0) + 1;
        }
    });
    return Object.entries(groups)
        .map(([name, value]) => ({ name, value }))
        .sort((a,b) => b.value - a.value);
  }, [cumulativeData]);

  if (data.length === 0) return (
    <div className="p-12 text-center text-slate-400 font-medium">
      Grafikler için veri bekleniyor...
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Zaman Kontrolü Paneli */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Segment Bazlı Analiz Filtresi</h3>
            <p className="text-[10px] text-slate-400">Seçilen saate kadar olan kümülatif verileri gösterir.</p>
          </div>
          <div className="flex-1 max-w-lg flex gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
             <input 
                type="range" 
                min="1" 
                max={maxHour} 
                value={timelineHour} 
                onChange={(e) => setTimelineHour(parseInt(e.target.value))} 
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
             />
             <span className="text-xs font-black text-blue-600 bg-white px-3 py-1 border border-blue-100 rounded shadow-sm whitespace-nowrap min-w-[100px] text-center">
                İlk {timelineHour} Saat
             </span>
          </div>
      </div>

      {/* Üçlü Metrik Grubu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-64 flex flex-col">
            <h4 className="text-[11px] font-bold text-slate-400 mb-4 uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Erişim Metrikleri
            </h4>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={authMetrics}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                        {authMetrics.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-64 flex flex-col">
            <h4 className="text-[11px] font-bold text-slate-400 mb-4 uppercase flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                İnternet Servis Etkileşimi
            </h4>
            <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-5xl font-black text-emerald-600 drop-shadow-sm">{serviceCount[0].value.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-widest">Başlatma / Bitiş Sayısı</p>
            </div>
            <div className="h-1.5 w-full bg-emerald-50 rounded-full mt-auto overflow-hidden">
                <div className="h-full bg-emerald-500" style={{width: '65%'}}></div>
            </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-64 flex flex-col">
            <h4 className="text-[11px] font-bold text-red-400 mb-4 uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Hata İzleme (Satınalım)
            </h4>
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className={`p-4 rounded-full ${errorCount[0].count > 10 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'} mb-2`}>
                    <p className="text-5xl font-black">{errorCount[0].count}</p>
                </div>
                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">Kritik Hata Sayısı</p>
            </div>
            <div className="mt-2 text-center">
                <span className="text-[9px] font-bold text-slate-300 italic">Sistem Sağlığı: %{Math.max(0, 100 - (errorCount[0].count * 2)).toFixed(1)}</span>
            </div>
        </div>
      </div>

      {/* Büyük Paneller: Cihaz, Paket, Uygulama ve Ödeme Yöntemi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* PANEL A: TEKİL BAĞLI CİHAZ */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md h-80 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
            <div className="absolute top-4 left-4">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bağlı Cihaz Sayısı</h4>
            </div>
            <div className="text-center z-10">
                <p className="text-6xl font-black text-blue-600 leading-none tracking-tighter group-hover:scale-105 transition-transform duration-300">{uniqueDevicesCount}</p>
                <p className="text-[9px] font-bold text-slate-400 mt-6 uppercase tracking-widest">Tekil MAC Adresi</p>
            </div>
        </div>

        {/* PANEL B: PAKET BAZLI MB */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md h-80 flex flex-col">
            <h4 className="text-[11px] font-bold text-slate-500 mb-6 uppercase tracking-wider border-b pb-2">Paket Bazlı Kullanım (MB)</h4>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={packageUsage} layout="vertical">
                        <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={75} tick={{fontSize: 8, fontWeight: 'bold'}} axisLine={false} />
                        <Tooltip formatter={(v: number) => [`${v.toLocaleString()} MB`, 'Veri']} />
                        <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={12} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* PANEL C: UYGULAMA BAZLI MB */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md h-80 flex flex-col">
            <h4 className="text-[11px] font-bold text-slate-500 mb-6 uppercase tracking-wider border-b pb-2">Uygulama Bazlı Kullanım (MB)</h4>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={appUsage} layout="vertical">
                        <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={75} tick={{fontSize: 8, fontWeight: 'bold'}} axisLine={false} />
                        <Tooltip formatter={(v: number) => [`${v.toLocaleString()} MB`, 'Veri']} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                            {appUsage.map((e, i) => <Cell key={i} fill={APP_COLORS[e.name as keyof typeof APP_COLORS] || '#8b5cf6'} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* PANEL D: ÖDEME YÖNTEMİ DAĞILIMI */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md h-80 flex flex-col">
            <h4 className="text-[11px] font-bold text-slate-500 mb-6 uppercase tracking-wider border-b pb-2">Ödeme Yöntemi Dağılımı</h4>
            <div className="flex-1">
                {paymentDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={paymentDistribution} layout="vertical">
                            <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={75} tick={{fontSize: 8, fontWeight: 'bold'}} axisLine={false} />
                            <Tooltip formatter={(v: number) => [v, 'İşlem Sayısı']} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                                {paymentDistribution.map((e, i) => (
                                    <Cell key={i} fill={PAYMENT_COLORS[e.name as keyof typeof PAYMENT_COLORS] || '#cbd5e1'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-[10px] text-slate-300 italic uppercase">Ödeme verisi bulunamadı</div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default PassengerDashboardCharts;
