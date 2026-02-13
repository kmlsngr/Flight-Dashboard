
import React from 'react';
import { AppUsageRecord } from '../types';
import { FileText } from 'lucide-react';

interface AppUsageDataTableProps {
  data: AppUsageRecord[];
  onExport?: () => void;
}

const AppUsageDataTable: React.FC<AppUsageDataTableProps> = ({ data, onExport }) => {
  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mt-6">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-700">Uçuş Bazlı Veri Kullanımı Bildirme Listesi</h3>
        {onExport && (
          <button 
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            Excel Aktar
          </button>
        )}
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Zaman (Saat)</th>
              <th className="px-4 py-3">Uçuş Tarihi</th>
              <th className="px-4 py-3">Uçuş ID</th>
              <th className="px-4 py-3">Kuyruk No</th>
              <th className="px-4 py-3">Uçuş No</th>
              <th className="px-4 py-3">Rota (Orig-Dest)</th>
              <th className="px-4 py-3">Bölge</th>
              <th className="px-4 py-3">Uçuş Sahası</th>
              <th className="px-4 py-3">Uçuş Tipi</th>
              <th className="px-4 py-3">Uygulama Türü</th>
              <th className="px-4 py-3 text-right">Yolcu Sayısı</th>
              <th className="px-4 py-3 text-right">Kullanım (MB)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.slice(0, 500).map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2 font-bold text-slate-700">{row.timeHour}. Saat</td>
                <td className="px-4 py-2 text-slate-600">{row.tarih}</td>
                <td className="px-4 py-2 text-blue-600">{row.flightId}</td>
                <td className="px-4 py-2 text-slate-600 font-mono">{row.kuyrukNumarasi}</td>
                <td className="px-4 py-2 text-slate-800">{row.ucusNumarasi}</td>
                <td className="px-4 py-2 text-slate-500">{row.origin}-{row.destination}</td>
                <td className="px-4 py-2 text-slate-600">{row.bolge}</td>
                <td className="px-4 py-2 text-slate-600">{row.ucusSahasi}</td>
                <td className="px-4 py-2 text-slate-600">{row.ucusTipi}</td>
                <td className="px-4 py-2 font-medium text-slate-800">{row.uygulamaTuru}</td>
                <td className="px-4 py-2 text-right text-slate-700">{row.yolcuSayisi}</td>
                <td className="px-4 py-2 text-right font-bold text-blue-600">{row.kullanimMiktariMB}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 border-t border-slate-200">
        {data.length > 500 ? `${data.length} kayıttan ilk 500 tanesi gösteriliyor.` : `${data.length} kayıt gösteriliyor.`}
      </div>
    </div>
  );
};

export default AppUsageDataTable;
