import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { FlightRecord, InternetKullanimDagilimi, LoginTipi } from '../types';

interface GeneralDashboardChartsProps {
  data: FlightRecord[];
}

const USAGE_COLORS: Record<string, string> = {
  [InternetKullanimDagilimi.DUSUK]: '#94a3b8',
  [InternetKullanimDagilimi.ORTA]: '#3b82f6',
  [InternetKullanimDagilimi.YUKSEK]: '#1d4ed8'
};

const LOGIN_COLORS: Record<string, string> = {
  [LoginTipi.NORMAL]: '#0d9488',
  [LoginTipi.PROMO]: '#6366f1',
  [LoginTipi.SCRATCH]: '#f43f5e'
};

const SUCCESS_COLOR = '#10b981';
const FAILED_COLOR = '#ef4444';

const GeneralDashboardCharts: React.FC<GeneralDashboardChartsProps> = ({ data }) => {
  
  const usageDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(d => {
      counts[d.internetKullanimDagilimi] = (counts[d.internetKullanimDagilimi] || 0) + 1;
    });
    return Object.keys(USAGE_COLORS).map(key => ({
      name: key,
      value: counts[key] || 0
    }));
  }, [data]);

  const purchasePerformance = useMemo(() => {
    let success = 0;
    let failed = 0;
    data.forEach(d => {
      success += d.basariliSatinAlimSayisi;
      failed += d.hataliSatinAlimSayisi;
    });
    return [
      { name: 'Başarılı Satın Alım', value: success },
      { name: 'Hata Alınan Satın Alım', value: failed }
    ];
  }, [data]);

  const assignmentPerformance = useMemo(() => {
    let success = 0;
    let failed = 0;
    data.forEach(d => {
      success += d.basariliPaketAtamaSayisi;
      failed += d.hataliPaketAtamaSayisi;
    });
    return [
      { name: 'Başarılı Paket Atama', value: success },
      { name: 'Başarısız Paket Atama', value: failed }
    ];
  }, [data]);

  const loginDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(d => {
      counts[d.loginTipi] = (counts[d.loginTipi] || 0) + 1;
    });
    return Object.keys(LOGIN_COLORS).map(key => ({
      name: key,
      value: counts[key] || 0
    }));
  }, [data]);

  const regionDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(d => {
      counts[d.bolge] = (counts[d.bolge] || 0) + d.baglananYolcuSayisi;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  if (data.length === 0) return <div className="p-8 text-center text-slate-500">Veri bulunamadı.</div>;

  const renderPieLabel = ({ name, percent }: any) => `${name} (%${(percent * 100).toFixed(1)})`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Genel Kullanım Yoğunluğu
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={usageDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={renderPieLabel}>
                  {usageDistribution.map((entry) => (
                    <Cell key={entry.name} fill={USAGE_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-green-600 rounded-full"></span>
            Satın Alım Performansı
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={purchasePerformance} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" label={renderPieLabel}>
                  <Cell fill={SUCCESS_COLOR} />
                  <Cell fill={FAILED_COLOR} />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
            Paket Atama Performansı
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assignmentPerformance} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" label={renderPieLabel}>
                  <Cell fill={SUCCESS_COLOR} />
                  <Cell fill={FAILED_COLOR} />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-teal-600 rounded-full"></span>
            Genel Login Yöntemleri
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={loginDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={renderPieLabel}>
                  {loginDistribution.map((entry) => (
                    <Cell key={entry.name} fill={LOGIN_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm col-span-1 md:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-orange-600 rounded-full"></span>
            Bölge Bazlı Toplam Bağlanan Yolcu
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" tick={{fontSize: 12}} />
                <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Toplam Yolcu']} />
                <Bar dataKey="value" name="Toplam Yolcu" fill="#f97316" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GeneralDashboardCharts;
