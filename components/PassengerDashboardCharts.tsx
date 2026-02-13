
import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
  AreaChart, Area, ReferenceLine, PieChart, Pie
} from 'recharts';
import { PassengerAnalysisRecord, PurchaseStatus, AppType } from '../types';

interface PassengerDashboardChartsProps {
  data: PassengerAnalysisRecord[];
}

const METRIC_COLORS = {
  session: '#3b82f6',     // Mavi
  internet: '#10b981',    // Yeşil
  login: '#6366f1',       // Indigo
  failed: '#ef4444'       // Kırmızı
};

const APP_COLORS: Record<string, string> = {
  [AppType.INSTAGRAM]: '#E1306C',
  [AppType.WHATSAPP]: '#25D366',
  [AppType.YOUTUBE]: '#FF0000',
  [AppType.NETFLIX]: '#E50914',
  [AppType.TIKTOK]: '#000000',
  [AppType.OTHER]: '#808080',
  ['N/A']: '#cbd5e1'
};

const PassengerDashboardCharts: React.FC<PassengerDashboardChartsProps> = ({ data }) => {
  const [timelineHour, setTimelineHour] = useState<number>(1);
  
  const maxHour = useMemo(() => {
      if (data.length === 0) return 10;
      return Math.max(...data.map(d => d.timeHour));
  }, [data]);

  useEffect(() => {
     if (timelineHour > maxHour && maxHour > 0) {
         setTimelineHour(maxHour);
     }
  }, [maxHour]);

  const cumulativeData = useMemo(() => {
      return data.filter(d => d.timeHour <= timelineHour);
  }, [data, timelineHour]);

  const hourlyActivityTrend = useMemo(() => {
    const groups: Record<number, {count: number, usage: number}> = {};
    data.forEach(d => {
        if (!groups[d.timeHour]) groups[d.timeHour] = {count: 0, usage: 0};
        groups[d.timeHour].count += 1;
        groups[d.timeHour].usage += d.dataUsageMB;
    });
    return Object.keys(groups).map(k => ({
        name: `${k}. Saat`,
        hour: parseInt(k),
        count: groups[parseInt(k)].count,
        usage: groups[parseInt(k)].usage
    })).sort((a,b) => a.hour - b.hour);
  }, [data]);

  // --- 1. GRUP: ERİŞİM (Session & Login) ---
  const authMetrics = useMemo(() => {
    let session = 0;
    let login = 0;
    cumulativeData.forEach(d => {
        session += d.sessionCount;
        login += d.loginCount;
    });
    return [
        { name: 'Oturum (Session)', count: session, fill: METRIC_COLORS.session },
        { name: 'Giriş (Login)', count: login, fill: METRIC_COLORS.login }
    ];
  }, [cumulativeData]);

  // --- 2. GRUP: KULLANIM (Internet Usage Status) ---
  const serviceMetrics = useMemo(() => {
    let internetTotal = 0;
    cumulativeData.forEach(d => {
        internetTotal += parseInt(d.internetUsageStatus) || 0;
    });
    return [{ name: 'İnternet Etkileşimi', value: internetTotal }];
  }, [cumulativeData]);

  // --- 3. GRUP: HATALAR (Failed Purchase Count) ---
  const errorMetrics = useMemo(() => {
    let failed = 0;
    cumulativeData.forEach(d => {
        failed += d.failedPurchaseCount;
    });
    return [{ name: 'Başarısız İşlem', count: failed }];
  }, [cumulativeData]);

  // --- 4. YENİ: BAĞLI CİHAZ SAYISI (Cumulative Unique MAC) ---
  const uniqueDeviceCount = useMemo(() => {
    const uniqueMacs = new Set(cumulativeData.map(d => d.mac));
    return uniqueMacs.size;
  }, [cumulativeData]);

  // --- 5. YENİ: PAKET BAZLI VERİ KULLANIMI (MB) ---
  const packageUsageData = useMemo(() => {
    const groups: Record<string, number> = {};
    cumulativeData.forEach(d => {
        if (d.usedPackageName && d.usedPackageName !== 'N/A') {
            groups[d.usedPackageName] = (groups[d.usedPackageName] || 0) + d.dataUsageMB;
        }
    });
    return Object.entries(groups)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
  }, [cumulativeData]);

  // --- 6. YENİ: UYGULAMA BAZLI VERİ KULLANIMI (MB) ---
  const appUsageData = useMemo(() => {
    const groups: Record<string, number> = {};
    cumulativeData.forEach(d => {
        if (d.usedAppName && d.usedAppName !== 'N/A') {
            groups[d.usedAppName] = (groups[d.usedAppName] || 0) + d.dataUsageMB;
        }
    });
    return Object.entries(groups)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
  }, [cumulativeData]);

  if (data.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Üst Zaman Çizelgesi */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">Uçuş Boyunca Aktivite ve Veri Yoğunluğu</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyActivityTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{fontSize: 11}} />
                    <YAxis tick={{fontSize: 11}} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="none" strokeWidth={2} name="Aktivite Sayısı" />
                    <Area type="monotone" dataKey="usage" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorUsage)" name="Veri Kullanımı (MB)" />
                    <ReferenceLine x={`${timelineHour}. Saat`} stroke="#ef4444" strokeDasharray="3 3" />
                </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-4 items-center bg-slate-50 p-3 rounded">
             <input type="range" min="1" max={maxHour} value={timelineHour} onChange={(e) => setTimelineHour(parseInt(e.target.value))} className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
             <span className="text-xs font-bold text-slate-600 whitespace-nowrap bg-white px-3 py-1 border rounded shadow-sm">
                Filtre: İlk {timelineHour} Saat
             </span>
          </div>
      </div>

      {/* Aktivite Metrikleri Grubu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-72">
            <h3 className="text-[11px] font-bold text-slate-500 mb-4 uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Erişim Metrikleri (Oturum & Login)
            </h3>
            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={authMetrics}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize: 10}} />
                    <YAxis tick={{fontSize: 10}} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="count" name="Toplam Adet" radius={[4, 4, 0, 0]}>
                        {authMetrics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-72">
            <h3 className="text-[11px] font-bold text-slate-500 mb-4 uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Servis Etkileşim Sayısı (İnternet)
            </h3>
            <div className="flex flex-col h-full">
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="70%">
                        <BarChart data={serviceMetrics}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" hide />
                            <YAxis tick={{fontSize: 10}} />
                            <Tooltip />
                            <Bar dataKey="value" name="Başlatma/Bitiş Sayısı" fill={METRIC_COLORS.internet} radius={[4, 4, 0, 0]} barSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-emerald-50 p-2 rounded text-center mb-6">
                    <p className="text-[10px] text-emerald-600 font-bold uppercase">Toplam Etkileşim</p>
                    <p className="text-xl font-black text-emerald-700">{serviceMetrics[0].value}</p>
                </div>
            </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-72">
            <h3 className="text-[11px] font-bold text-red-500 mb-4 uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Kritik Hata Takibi (Satınalım)
            </h3>
            <div className="flex flex-col h-full">
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="70%">
                        <BarChart data={errorMetrics}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" hide />
                            <YAxis tick={{fontSize: 10}} />
                            <Tooltip />
                            <Bar dataKey="count" name="Hata Sayısı" fill={METRIC_COLORS.failed} radius={[4, 4, 0, 0]} barSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-red-50 p-2 rounded text-center mb-6 border border-red-100">
                    <p className="text-[10px] text-red-600 font-bold uppercase">Başarısız İşlem</p>
                    <p className="text-xl font-black text-red-700">{errorMetrics[0].count}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Yeni: Cihaz, Paket ve Uygulama Kullanım Grubu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PANEL 4: TEKİL BAĞLI CİHAZ SAYISI */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-80 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-4">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase">Bağlı Cihaz Sayısı</h3>
            </div>
            <div className="text-center z-10">
                <p className="text-6xl font-black text-blue-600 drop-shadow-sm">{uniqueDeviceCount}</p>
                <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Tekil MAC Adresi</p>
                <div className="mt-4 px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-100">
                    İlk {timelineHour} Saatlik Birikim
                </div>
            </div>
            {/* Arka plan dekoratif icon/grafik */}
            <div className="absolute -bottom-6 -right-6 opacity-5">
                <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </div>
        </div>

        {/* PANEL 5: PAKET BAZLI VERİ KULLANIMI */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-80">
            <h3 className="text-[11px] font-bold text-slate-500 mb-4 uppercase">Paket Bazlı Veri Tüketimi (MB)</h3>
            {packageUsageData.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={packageUsageData} layout="vertical" margin={{ left: 10, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={90} tick={{fontSize: 10, fontWeight: 'bold'}} />
                        <Tooltip formatter={(val: number) => [`${val.toLocaleString()} MB`, 'Tüketim']} />
                        <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={25} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">Veri bulunamadı.</div>
            )}
        </div>

        {/* PANEL 6: UYGULAMA BAZLI VERİ KULLANIMI */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-80">
            <h3 className="text-[11px] font-bold text-slate-500 mb-4 uppercase">Uygulama Bazlı Veri Tüketimi (MB)</h3>
            {appUsageData.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={appUsageData} layout="vertical" margin={{ left: 10, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10, fontWeight: 'bold'}} />
                        <Tooltip formatter={(val: number) => [`${val.toLocaleString()} MB`, 'Tüketim']} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                            {appUsageData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={APP_COLORS[entry.name] || '#8b5cf6'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">Veri bulunamadı.</div>
            )}
        </div>

      </div>
    </div>
  );
};

export default PassengerDashboardCharts;
