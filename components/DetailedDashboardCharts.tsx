
import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ReferenceLine
} from 'recharts';
import { 
  DetailedFlightRecord, 
  InternetKullanimDagilimi, 
  PaketTuru, 
  LoginTipi, 
  BasarisizOlmaNedeni, 
  PaketAtamaDurumu 
} from '../types';
import { AlertCircle, BarChart3 } from 'lucide-react';

interface DetailedDashboardChartsProps {
  data: DetailedFlightRecord[];
  selectedTails: string[];
}

// Renk paletleri (Ekran görüntülerindeki renklerle uyumlu)
const USAGE_COLORS: Record<string, string> = {
  [InternetKullanimDagilimi.DUSUK]: '#94a3b8',   // Slate / Gray
  [InternetKullanimDagilimi.ORTA]: '#3b82f6',    // Blue
  [InternetKullanimDagilimi.YUKSEK]: '#1d4ed8'   // Dark Blue
};

const LOGIN_COLORS: Record<string, string> = {
  [LoginTipi.NORMAL]: '#0d9488',   // Teal
  [LoginTipi.PROMO]: '#6366f1',    // Indigo
  [LoginTipi.SCRATCH]: '#f43f5e'   // Rose/Pink
};

const PACKAGE_COLORS: Record<string, string> = {
  [PaketTuru.MESSAGING]: '#10b981', // Emerald
  [PaketTuru.SURF]: '#3b82f6',      // Blue
  [PaketTuru.STREAM]: '#f472b6',    // Pink
  [PaketTuru.UNLIMITED]: '#a78bfa'  // Violet/Purple
};

const DetailedDashboardCharts: React.FC<DetailedDashboardChartsProps> = ({ data, selectedTails }) => {
  const [timelineHour, setTimelineHour] = useState<number>(1);
  
  const maxHour = useMemo(() => {
      if (data.length === 0) return 10;
      return Math.max(...data.map(d => d.timeHour));
  }, [data]);

  useEffect(() => {
     if (timelineHour > maxHour && maxHour > 0) setTimelineHour(maxHour);
  }, [maxHour]);

  const cumulativeData = useMemo(() => {
      return data.filter(d => d.timeHour <= timelineHour);
  }, [data, timelineHour]);

  const tailsToShow = useMemo(() => {
    if (selectedTails && selectedTails.length > 0) return [...selectedTails].sort();
    const uniqueTails = Array.from(new Set(data.map(d => d.kuyrukNumarasi)));
    return uniqueTails.sort().slice(0, 10); // Çok fazla kuyruk varsa ilk 10'u göster
  }, [data, selectedTails]);

  // 1. ZAMAN BAZLI BAĞLANTI GRAFİĞİ VERİSİ
  const hourlyData = useMemo(() => {
    const groups: Record<number, { connected: number, disconnected: number, count: number }> = {};
    cumulativeData.forEach(d => {
        if (!groups[d.timeHour]) groups[d.timeHour] = { connected: 0, disconnected: 0, count: 0 };
        groups[d.timeHour].connected += d.connectedPax;
        groups[d.timeHour].disconnected += d.disconnectedPax;
        groups[d.timeHour].count += 1;
    });
    return Object.keys(groups).map(h => ({
        hour: `Saat ${h}`,
        hourValue: parseInt(h),
        Connected: Math.round(groups[parseInt(h)].connected / groups[parseInt(h)].count),
        Disconnected: Math.round(groups[parseInt(h)].disconnected / groups[parseInt(h)].count)
    })).sort((a, b) => a.hourValue - b.hourValue);
  }, [cumulativeData]);

  // 2. KUYRUK BAZINDA LOGIN TIPI DAĞILIMI
  const loginStatsByTail = useMemo(() => {
    const groups: Record<string, any> = {};
    tailsToShow.forEach(tail => {
        groups[tail] = { name: tail, total: 0 };
        Object.values(LoginTipi).forEach(type => groups[tail][type] = 0);
    });

    data.forEach(d => {
        if (groups[d.kuyrukNumarasi]) {
            groups[d.kuyrukNumarasi][d.loginType] += 1;
            groups[d.kuyrukNumarasi].total += 1;
        }
    });

    return tailsToShow.map(tail => {
        const g = groups[tail];
        Object.values(LoginTipi).forEach(type => {
            g[`${type}_percent`] = g.total > 0 ? ((g[type] / g.total) * 100).toFixed(1) : 0;
        });
        return g;
    });
  }, [data, tailsToShow]);

  // 3. KUYRUK BAZINDA SATIN ALIM DAĞILIMI
  const purchaseStatsByTail = useMemo(() => {
    const groups: Record<string, any> = {};
    tailsToShow.forEach(tail => {
        groups[tail] = { name: tail, total: 0 };
        Object.values(PaketTuru).forEach(type => groups[tail][type] = 0);
    });

    data.forEach(d => {
        if (groups[d.kuyrukNumarasi] && d.purchasedPackage) {
            groups[d.kuyrukNumarasi][d.purchasedPackage] += 1;
            groups[d.kuyrukNumarasi].total += 1;
        }
    });

    return tailsToShow.map(tail => {
        const g = groups[tail];
        Object.values(PaketTuru).forEach(type => {
            g[`${type}_percent`] = g.total > 0 ? ((g[type] / g.total) * 100).toFixed(1) : 0;
        });
        return g;
    });
  }, [data, tailsToShow]);

  // 4. KUYRUK BAZINDA KULLANIM YOĞUNLUĞU
  const usageStatsByTail = useMemo(() => {
    const groups: Record<string, any> = {};
    tailsToShow.forEach(tail => {
        groups[tail] = { name: tail, total: 0 };
        Object.keys(USAGE_COLORS).forEach(key => groups[tail][key] = 0);
    });

    data.forEach(d => {
      if (groups[d.kuyrukNumarasi]) {
        const usageType = d.usageAmountMB > 100 ? InternetKullanimDagilimi.YUKSEK : d.usageAmountMB > 10 ? InternetKullanimDagilimi.ORTA : InternetKullanimDagilimi.DUSUK;
        groups[d.kuyrukNumarasi][usageType] += 1;
        groups[d.kuyrukNumarasi].total += 1;
      }
    });

    return tailsToShow.map(tail => {
      const g = groups[tail];
      Object.keys(USAGE_COLORS).forEach(key => {
        g[`${key}_percent`] = g.total > 0 ? ((g[key] / g.total) * 100).toFixed(1) : 0;
      });
      return g;
    });
  }, [data, tailsToShow]);

  const failureReasonStats = useMemo(() => {
    const stats: Record<string, number> = {};
    data.forEach(d => {
        if (d.failureReason !== BasarisizOlmaNedeni.NONE) {
            stats[d.failureReason] = (stats[d.failureReason] || 0) + d.failedPurchases;
        }
    });
    return Object.entries(stats).map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count);
  }, [data]);

  return (
    <div className="space-y-6">
      
      {/* 1. Üst Panel: Timeline */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2 uppercase">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            Uçuş Süreci Bağlantı Trendi (Kümülatif)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <XAxis dataKey="hour" tick={{fontSize: 10, fill: '#64748b'}} />
                <YAxis tick={{fontSize: 10, fill: '#64748b'}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="Connected" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="Bağlı Yolcu" />
                <Area type="monotone" dataKey="Disconnected" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} name="Bağlantısı Kopan" />
                <ReferenceLine x={`Saat ${timelineHour}`} stroke="#10b981" strokeDasharray="3 3" />
              </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex gap-4 items-center">
             <input type="range" min="1" max={maxHour} value={timelineHour} onChange={(e) => setTimelineHour(parseInt(e.target.value))} className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
             <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded border border-blue-100 min-w-[100px] text-center">İlk {timelineHour} Saat</span>
        </div>
      </div>

      {/* 2. DAĞILIM GRAFİKLERİ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grafik 1: Login Tipi */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col h-[400px]">
            <h3 className="text-xs font-bold text-slate-700 mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-teal-600 rounded-full"></span>
                Kuyruk Bazında Login Tipi Dağılımı
            </h3>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={loginStatsByTail} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{fontSize: 9, fill: '#64748b'}} />
                        <YAxis tick={{fontSize: 9, fill: '#64748b'}} />
                        <Tooltip formatter={(val: number, name: string, props: any) => [`${val} Adet (%${props.payload[`${name}_percent`]})`, name]} />
                        <Legend iconType="rect" wrapperStyle={{fontSize: '10px', paddingTop: '20px'}} />
                        {Object.entries(LOGIN_COLORS).map(([type, color]) => (
                            <Bar key={type} dataKey={type} stackId="a" fill={color} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Grafik 2: Satın Alım Dağılımı */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col h-[400px]">
            <h3 className="text-xs font-bold text-slate-700 mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-600 rounded-full"></span>
                Kuyruk Bazında Satın Alım Dağılımı
            </h3>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={purchaseStatsByTail} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{fontSize: 9, fill: '#64748b'}} />
                        <YAxis tick={{fontSize: 9, fill: '#64748b'}} />
                        <Tooltip formatter={(val: number, name: string, props: any) => [`${val} Adet (%${props.payload[`${name}_percent`]})`, name]} />
                        <Legend iconType="rect" wrapperStyle={{fontSize: '10px', paddingTop: '20px'}} />
                        {Object.entries(PACKAGE_COLORS).map(([type, color]) => (
                            <Bar key={type} dataKey={type} stackId="a" fill={color} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Grafik 3: Kullanım Dağılımı */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col h-[400px]">
            <h3 className="text-xs font-bold text-slate-700 mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                Kuyruk Bazında Kullanım Dağılımı
            </h3>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageStatsByTail} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{fontSize: 9, fill: '#64748b'}} />
                        <YAxis tick={{fontSize: 9, fill: '#64748b'}} />
                        <Tooltip formatter={(val: number, name: string, props: any) => [`${val} Adet (%${props.payload[`${name}_percent`]})`, name]} />
                        <Legend iconType="rect" wrapperStyle={{fontSize: '10px', paddingTop: '20px'}} />
                        {Object.entries(USAGE_COLORS).map(([type, color]) => (
                            <Bar key={type} dataKey={type} stackId="a" fill={color} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>

      {/* 3. Özet Paneller: Hata Analizi (Performans Karnesi kaldırıldı) */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-red-600 mb-6 flex items-center gap-2 uppercase">
            <AlertCircle className="w-4 h-4" />
            Kritik Satınalım Hata Analizi
        </h3>
        <div className="overflow-hidden border border-slate-100 rounded-md">
          <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                  <tr>
                      <th className="px-4 py-3">Hata Nedeni</th>
                      <th className="px-4 py-3 text-right">İşlem</th>
                      <th className="px-4 py-3 text-right">Pay</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                  {failureReasonStats.length > 0 ? failureReasonStats.map((stat) => (
                      <tr key={stat.reason} className="hover:bg-red-50/30">
                          <td className="px-4 py-3 font-medium text-slate-700">{stat.reason}</td>
                          <td className="px-4 py-3 text-right font-bold">{stat.count}</td>
                          <td className="px-4 py-3 text-right text-red-600 font-black">
                              %{((stat.count / failureReasonStats.reduce((a,b)=>a+b.count, 0)) * 100).toFixed(1)}
                          </td>
                      </tr>
                  )) : <tr><td colSpan={3} className="p-4 text-center text-slate-400">Veri yok.</td></tr>}
              </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DetailedDashboardCharts;
