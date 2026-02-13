
import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { AppUsageRecord, AppType } from '../types';

interface AppUsageDashboardChartsProps {
  data: AppUsageRecord[];
}

const APP_COLORS: Record<string, string> = {
  [AppType.INSTAGRAM]: '#E1306C',
  [AppType.WHATSAPP]: '#25D366',
  [AppType.YOUTUBE]: '#FF0000',
  [AppType.NETFLIX]: '#E50914',
  [AppType.TIKTOK]: '#000000',
  [AppType.OTHER]: '#808080',
  [AppType.UNKNOWN]: '#CCCCCC'
};

const AppUsageDashboardCharts: React.FC<AppUsageDashboardChartsProps> = ({ data }) => {
  const [timelineHour, setTimelineHour] = useState<number>(1);
  
  // Determine max hour to set slider range
  const maxHour = useMemo(() => {
      if (data.length === 0) return 10;
      return Math.max(...data.map(d => d.timeHour));
  }, [data]);

  // Adjust slider if data changes
  useEffect(() => {
     if (timelineHour > maxHour && maxHour > 0) {
         setTimelineHour(maxHour);
     }
  }, [maxHour]);

  // Filter data to show only up to the selected hour on the X-Axis
  const filteredData = useMemo(() => {
      return data.filter(d => d.timeHour <= timelineHour);
  }, [data, timelineHour]);
  
  // 1. Hourly Discrete Data (For Both Charts)
  const hourlyDiscreteData = useMemo(() => {
    const groups: Record<number, Record<string, number>> = {};
    
    // Initialize groups for all hours up to timeline to ensure X-axis continuity
    for(let i=1; i<=timelineHour; i++) {
        groups[i] = { hour: i };
    }

    filteredData.forEach(d => {
      if (!groups[d.timeHour]) groups[d.timeHour] = { hour: d.timeHour };
      
      // Initialize keys if not exist
      if (!groups[d.timeHour][`${d.uygulamaTuru}_MB`]) groups[d.timeHour][`${d.uygulamaTuru}_MB`] = 0;
      if (!groups[d.timeHour][`${d.uygulamaTuru}_Pax`]) groups[d.timeHour][`${d.uygulamaTuru}_Pax`] = 0;
      
      // Sum Discrete Values
      groups[d.timeHour][`${d.uygulamaTuru}_MB`] += d.kullanimMiktariMB;
      groups[d.timeHour][`${d.uygulamaTuru}_Pax`] += d.yolcuSayisi;
    });

    return Object.values(groups)
        .sort((a, b) => (a.hour as number) - (b.hour as number))
        .map(g => ({
            name: `${g.hour}. Saat`,
            ...g
        }));
  }, [filteredData, timelineHour]);

  // 2. Total App Usage Summary (Aggregated over the selected time range)
  const totalAppUsage = useMemo(() => {
    const groups: Record<string, number> = {};
    filteredData.forEach(d => {
        if (!groups[d.uygulamaTuru]) groups[d.uygulamaTuru] = 0;
        groups[d.uygulamaTuru] += d.kullanimMiktariMB;
    });
    return Object.keys(groups).map(k => ({ name: k, value: groups[k] })).sort((a, b) => b.value - a.value);
  }, [filteredData]);


  if (data.length === 0) return <div className="p-8 text-center text-slate-500">Veri bulunamadı.</div>;

  const appKeys = Object.keys(APP_COLORS);

  return (
    <div className="space-y-6">
      
       {/* Global Timeline Control */}
       <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Rapor Zaman Aralığı (Saatlik Kırılım)
                </span>
                <span className="text-sm font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded shadow-sm min-w-[120px] text-center">
                İlk {timelineHour} Saat
                </span>
            </div>
            
            <div className="relative mb-2 group px-2">
                <input
                    type="range"
                    min="1"
                    max={maxHour > 0 ? maxHour : 12}
                    value={timelineHour}
                    onChange={(e) => setTimelineHour(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all z-10 relative"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
                    <span>Başlangıç</span>
                    <span>Bitiş ({maxHour}. Saat)</span>
                </div>
            </div>
       </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Chart 1: Hourly Passenger Count */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-96">
          <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">Saatlik Uygulama Bazlı Yolcu Dağılımı</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={hourlyDiscreteData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Legend />
              {appKeys.map(app => (
                <Bar 
                    key={app} 
                    dataKey={`${app}_Pax`} 
                    name={app}
                    stackId="a" 
                    fill={APP_COLORS[app] || '#8884d8'} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Hourly MB Usage */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-96">
          <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">Saatlik Uygulama Bazlı Veri Kullanım Grafiği (MB)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={hourlyDiscreteData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip />
                <Legend />
                {appKeys.map(app => (
                    <Line 
                        key={app} 
                        type="monotone" 
                        dataKey={`${app}_MB`} 
                        name={app}
                        stroke={APP_COLORS[app] || '#8884d8'} 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Total Summary */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-80">
          <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">Uygulama Kullanım Özeti (Seçilen Saat Aralığı Toplamı)</h3>
          <ResponsiveContainer width="100%" height="90%">
             <BarChart data={totalAppUsage} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="value" name="Toplam MB" fill="#8884d8">
                    {totalAppUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={APP_COLORS[entry.name] || '#8884d8'} />
                    ))}
                </Bar>
             </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default AppUsageDashboardCharts;
