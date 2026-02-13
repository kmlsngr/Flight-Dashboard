import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { FlightRecord } from '../types';

interface DashboardChartsProps {
  data: FlightRecord[];
}

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#ef4444', '#a855f7', '#6366f1'];

const DashboardCharts: React.FC<DashboardChartsProps> = ({ data }) => {
  
  // 1. Calculate Tail Number Total Usage
  const tailData = useMemo(() => {
    const groups: Record<string, number> = {};
    data.forEach(d => {
      if (!groups[d.kuyrukNumarasi]) groups[d.kuyrukNumarasi] = 0;
      groups[d.kuyrukNumarasi] += d.baglananYolcuSayisi;
    });

    return Object.keys(groups).map(k => ({
      name: k,
      ToplamBaglanan: groups[k]
    })).sort((a, b) => b.ToplamBaglanan - a.ToplamBaglanan);
  }, [data]);

  // 2. Calculate Monthly Trends
  const monthlyData = useMemo(() => {
    const groups: Record<string, { connected: number }> = {};
    
    // Sort data by date first for correct month order
    const sortedData = [...data].sort((a, b) => new Date(a.tarih).getTime() - new Date(b.tarih).getTime());

    sortedData.forEach(d => {
      const monthKey = d.aylikOrtKirilim.split(' ')[0]; // Extract Month Name
      if (!groups[monthKey]) groups[monthKey] = { connected: 0 };
      groups[monthKey].connected += d.baglananYolcuSayisi;
    });

    // Turkish Month Order fix
    const monthOrder = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    
    return monthOrder.map(m => {
       if(!groups[m]) return null;
       return {
         name: m,
         ToplamBaglanan: groups[m].connected
       };
    }).filter(Boolean);
  }, [data]);

  // 3. Stats Summary
  const stats = useMemo(() => {
    const totalFlights = data.length;
    const totalConnected = data.reduce((acc, curr) => acc + curr.baglananYolcuSayisi, 0);
    
    return { totalFlights, totalConnected };
  }, [data]);

  // 4. Region Distribution (Pie Chart)
  const regionData = useMemo(() => {
    const groups: Record<string, number> = {};
    data.forEach(d => {
      if (!groups[d.bolge]) groups[d.bolge] = 0;
      groups[d.bolge] += d.baglananYolcuSayisi;
    });
    return Object.keys(groups).map(k => ({ name: k, value: groups[k] }));
  }, [data]);

  // 5. Membership Distribution (Donut Chart)
  const membershipData = useMemo(() => {
    const groups: Record<string, number> = {};
    data.forEach(d => {
      if (!groups[d.uyelikTipi]) groups[d.uyelikTipi] = 0;
      groups[d.uyelikTipi] += d.baglananYolcuSayisi;
    });
    return Object.keys(groups).map(k => ({ name: k, value: groups[k] })).sort((a,b) => b.value - a.value);
  }, [data]);

  // 6. Package Distribution (Bar Chart)
  const packageData = useMemo(() => {
    const groups: Record<string, number> = {};
    data.forEach(d => {
      if (!groups[d.satinAlinanPaketTuru]) groups[d.satinAlinanPaketTuru] = 0;
      groups[d.satinAlinanPaketTuru] += d.baglananYolcuSayisi;
    });
    return Object.keys(groups).map(k => ({ name: k, value: groups[k] })).sort((a,b) => b.value - a.value);
  }, [data]);

  // 7. Usage Distribution (Bar Chart)
  const usageData = useMemo(() => {
    const groups: Record<string, number> = {};
    data.forEach(d => {
      if (!groups[d.internetKullanimDagilimi]) groups[d.internetKullanimDagilimi] = 0;
      groups[d.internetKullanimDagilimi] += 1;
    });
    return Object.keys(groups).map(k => ({ name: k, value: groups[k] }));
  }, [data]);

  if (data.length === 0) {
    return <div className="p-8 text-center text-slate-500">Veri bulunamadı. Lütfen filtreleri kontrol ediniz.</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Toplam Uçuş</p>
          <p className="text-2xl font-bold text-slate-800">{stats.totalFlights}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Toplam Bağlanan Yolcu</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalConnected.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tail Number Chart */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-80">
          <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">Kuyruk Bazlı Toplam Bağlanan Yolcu</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={tailData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} />
              <Tooltip formatter={(value: number) => [value, 'Toplam Bağlanan']} contentStyle={{fontSize: '12px'}} />
              <Legend />
              <Bar dataKey="ToplamBaglanan" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Toplam Bağlanan" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-80">
          <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">Aylık Toplam Bağlanan Yolcu (2025)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip contentStyle={{fontSize: '12px'}} />
              <Legend />
              <Line type="monotone" dataKey="ToplamBaglanan" stroke="#e11d48" strokeWidth={2} name="Bağlanan Yolcu" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Region Distribution - Pie Chart */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-80">
          <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">Bölge Bazlı Bağlanan Yolcu Dağılımı</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Membership Type - Donut Chart */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-80">
          <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">Üyelik Tipine Göre Bağlanan Yolcu</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={membershipData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name }) => name}
              >
                {membershipData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Package Preferences - Bar Chart */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-80">
          <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">Tercih Edilen İnternet Paketi (Yolcu Bazlı)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={packageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Legend />
              <Bar dataKey="value" fill="#8b5cf6" name="Yolcu Sayısı" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Internet Usage Levels - Bar Chart */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-80">
          <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">Uçuş Başına İnternet Kullanım Seviyesi</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 11}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Legend />
              <Bar dataKey="value" fill="#f59e0b" name="Uçuş Sayısı" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default DashboardCharts;