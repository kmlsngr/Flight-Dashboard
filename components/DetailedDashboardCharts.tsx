
import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, ReferenceLine
} from 'recharts';
import { DetailedFlightRecord, AppType, InternetKullanimDagilimi, PaketTuru, LoginTipi } from '../types';

interface DetailedDashboardChartsProps {
  data: DetailedFlightRecord[];
  selectedTails: string[];
}

const USAGE_COLORS: Record<string, string> = {
  [InternetKullanimDagilimi.DUSUK]: '#94a3b8',
  [InternetKullanimDagilimi.ORTA]: '#3b82f6',
  [InternetKullanimDagilimi.YUKSEK]: '#1d4ed8'
};
const PACKAGE_COLORS: Record<string, string> = {
  [PaketTuru.MESSAGING]: '#4ade80',
  [PaketTuru.SURF]: '#60a5fa',
  [PaketTuru.STREAM]: '#f472b6',
  [PaketTuru.UNLIMITED]: '#a78bfa'
};
const LOGIN_COLORS: Record<string, string> = {
  [LoginTipi.NORMAL]: '#0d9488',
  [LoginTipi.PROMO]: '#6366f1',
  [LoginTipi.SCRATCH]: '#f43f5e'
};

const DetailedDashboardCharts: React.FC<DetailedDashboardChartsProps> = ({ data, selectedTails }) => {
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

  // Determine which tails to show in reports
  const tailsToShow = useMemo(() => {
    // If tails are selected in the filter, use them. 
    // Otherwise, find all unique tails in the current data.
    if (selectedTails && selectedTails.length > 0) {
      return [...selectedTails].sort();
    }
    const uniqueTails = Array.from(new Set(data.map(d => d.kuyrukNumarasi)));
    return uniqueTails.sort();
  }, [data, selectedTails]);

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

  const cumulativeStats = useMemo(() => {
      if (cumulativeData.length === 0) return null;
      const totalRecords = cumulativeData.length;
      const avgConnected = Math.round(cumulativeData.reduce((acc, curr) => acc + curr.connectedPax, 0) / totalRecords);
      const totalDisconnected = cumulativeData.reduce((acc, curr) => acc + curr.disconnectedPax, 0);
      const totalUsage = cumulativeData.reduce((acc, curr) => acc + curr.usageAmountMB, 0);
      return { avgConnected, totalDisconnected, totalUsage };
  }, [cumulativeData]);

  // TAIL NUMBER SPECIFIC CALCULATIONS
  const usageStatsByTail = useMemo(() => {
    const groups: Record<string, Record<string, number>> = {};
    // Pre-initialize groups for all tails to show (to ensure they appear even with 0 data)
    tailsToShow.forEach(tail => {
        groups[tail] = { total: 0 };
        Object.keys(USAGE_COLORS).forEach(key => groups[tail][key] = 0);
    });

    data.forEach(d => {
      if (!groups[d.kuyrukNumarasi]) return; // Skip if not in display list
      const usageType = d.usageAmountMB > 100 ? InternetKullanimDagilimi.YUKSEK : d.usageAmountMB > 10 ? InternetKullanimDagilimi.ORTA : InternetKullanimDagilimi.DUSUK;
      groups[d.kuyrukNumarasi][usageType] += 1;
      groups[d.kuyrukNumarasi].total += 1;
    });

    return tailsToShow.map(tail => {
      const g = groups[tail];
      const result: any = { name: tail };
      Object.keys(USAGE_COLORS).forEach(key => {
        const count = g[key] || 0;
        result[key] = count;
        result[`${key}_percent`] = g.total > 0 ? ((count / g.total) * 100).toFixed(1) : 0;
      });
      return result;
    });
  }, [data, tailsToShow]);

  const purchaseStatsByTail = useMemo(() => {
    const groups: Record<string, Record<string, number>> = {};
    // Pre-initialize
    tailsToShow.forEach(tail => {
        groups[tail] = { total: 0 };
        Object.keys(PACKAGE_COLORS).forEach(key => groups[tail][key] = 0);
    });

    data.forEach(d => {
      if (!groups[d.kuyrukNumarasi]) return;
      groups[d.kuyrukNumarasi][d.purchasedPackage] = (groups[d.kuyrukNumarasi][d.purchasedPackage] || 0) + 1;
      groups[d.kuyrukNumarasi].total += 1;
    });

    return tailsToShow.map(tail => {
      const g = groups[tail];
      const result: any = { name: tail };
      Object.keys(PACKAGE_COLORS).forEach(key => {
        const count = g[key] || 0;
        result[key] = count;
        result[`${key}_percent`] = g.total > 0 ? ((count / g.total) * 100).toFixed(1) : 0;
      });
      return result;
    });
  }, [data, tailsToShow]);

  const loginStatsByTail = useMemo(() => {
    const groups: Record<string, Record<string, number>> = {};
    // Pre-initialize
    tailsToShow.forEach(tail => {
        groups[tail] = { total: 0 };
        Object.keys(LOGIN_COLORS).forEach(key => groups[tail][key] = 0);
    });

    data.forEach(d => {
      if (!groups[d.kuyrukNumarasi]) return;
      groups[d.kuyrukNumarasi][d.loginType] = (groups[d.kuyrukNumarasi][d.loginType] || 0) + 1;
      groups[d.kuyrukNumarasi].total += 1;
    });

    return tailsToShow.map(tail => {
      const g = groups[tail];
      const result: any = { name: tail };
      Object.keys(LOGIN_COLORS).forEach(key => {
        const count = g[key] || 0;
        result[key] = count;
        result[`${key}_percent`] = g.total > 0 ? ((count / g.total) * 100).toFixed(1) : 0;
      });
      return result;
    });
  }, [data, tailsToShow]);

  if (data.length === 0 && tailsToShow.length === 0) return <div className="p-8 text-center text-slate-500">Veri bulunamadı.</div>;

  const tailTooltipFormatter = (value: number, name: string, props: any) => {
    const percent = props.payload[`${name}_percent`];
    return [`${value} Adet (%${percent})`, name];
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Timeline and Cumulative KPI */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">Uçuş Süreci Boyunca Bağlantı Durumu (Kümülatif İlerleme)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="hour" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="Connected" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="Bağlı Yolcu" />
                <Area type="monotone" dataKey="Disconnected" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} name="Bağlantısı Kopan" />
                <ReferenceLine x={`Saat ${timelineHour}`} stroke="#10b981" label="Şu An" />
              </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 w-full">
                <input type="range" min="1" max={maxHour} value={timelineHour} onChange={(e) => setTimelineHour(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
                    <span>Başlangıç</span>
                    <span>Bitiş ({maxHour}. Saat)</span>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100 min-w-[300px]">
                <div className="text-center"><span className="block text-xs text-slate-500">Ort. Bağlı</span><span className="text-lg font-bold text-blue-600">{cumulativeStats?.avgConnected}</span></div>
                <div className="text-center border-l border-slate-200"><span className="block text-xs text-slate-500">Toplam Kopan</span><span className="text-lg font-bold text-red-500">{cumulativeStats?.totalDisconnected}</span></div>
                <div className="text-center border-l border-slate-200"><span className="block text-xs text-slate-500">Veri (GB)</span><span className="text-lg font-bold text-purple-600">{((cumulativeStats?.totalUsage || 0) / 1024).toFixed(1)}</span></div>
            </div>
        </div>
      </div>

      {/* 2. Tail Number Breakdowns */}
      <div className="grid grid-cols-1 gap-6">
        
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Kuyruk Bazında Kullanım Dağılımı {selectedTails.length > 0 && "(Seçili Kuyruklar)"}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageStatsByTail} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={tailTooltipFormatter} />
                <Legend />
                {Object.entries(USAGE_COLORS).map(([key, color]) => (
                  <Bar key={key} dataKey={key} stackId="a" fill={color} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
              Kuyruk Bazında Satın Alım Dağılımı {selectedTails.length > 0 && "(Seçili Kuyruklar)"}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={purchaseStatsByTail} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={tailTooltipFormatter} />
                <Legend />
                {Object.entries(PACKAGE_COLORS).map(([key, color]) => (
                  <Bar key={key} dataKey={key} stackId="a" fill={color} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-teal-600 rounded-full"></span>
              Kuyruk Bazında Login Tipi Dağılımı {selectedTails.length > 0 && "(Seçili Kuyruklar)"}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loginStatsByTail} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={tailTooltipFormatter} />
                <Legend />
                {Object.entries(LOGIN_COLORS).map(([key, color]) => (
                  <Bar key={key} dataKey={key} stackId="a" fill={color} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailedDashboardCharts;
