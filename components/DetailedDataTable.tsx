import React from 'react';
import { DetailedFlightRecord } from '../types';
import { FileText } from 'lucide-react';

interface DetailedDataTableProps {
  data: DetailedFlightRecord[];
  onExport?: () => void;
}

const DetailedDataTable: React.FC<DetailedDataTableProps> = ({ data, onExport }) => {
  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mt-6">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-700">Uçuş Bazlı Saatlik Detay Raporu</h3>
            <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">DPI Verisi: {data.filter(d => d.hasDpiData).length > 0 ? 'Mevcut' : 'Yok'}</span>
        </div>
        {onExport && (
          <button 
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            Listeyi Dışa Aktar
          </button>
        )}
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-3 py-3">Saat</th>
              <th className="px-3 py-3">Uçuş ID</th>
              <th className="px-3 py-3">Kuyruk</th>
              <th className="px-3 py-3">Rota</th>
              <th className="px-3 py-3 text-center">Bağlı/Kopan (Pax)</th>
              <th className="px-3 py-3 text-center">Bağlı/Kopan (Cihaz)</th>
              <th className="px-3 py-3 text-center">Başlangıç/Bitiş</th>
              <th className="px-3 py-3">M&S Tip</th>
              <th className="px-3 py-3 text-right">Kullanım (MB)</th>
              <th className="px-3 py-3 text-center">Satın Alım (Başarılı/Hata)</th>
              <th className="px-3 py-3">Hata Nedeni</th>
              <th className="px-3 py-3">Paket Atama</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.slice(0, 100).map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 py-2 font-bold text-slate-700">{row.timeHour}. Saat</td>
                <td className="px-3 py-2 text-blue-600">{row.flightId}</td>
                <td className="px-3 py-2 text-slate-600 font-mono">{row.kuyrukNumarasi}</td>
                <td className="px-3 py-2 text-slate-500">{row.origin}-{row.destination}</td>
                <td className="px-3 py-2 text-center">
                    <span className="text-green-600 font-bold">{row.connectedPax}</span> / <span className="text-red-500">{row.disconnectedPax}</span>
                </td>
                <td className="px-3 py-2 text-center">
                    <span className="text-blue-600">{row.connectedDevices}</span> / <span className="text-slate-400">{row.disconnectedDevices}</span>
                </td>
                 <td className="px-3 py-2 text-center text-slate-500">
                    +{row.internetStartPax} / -{row.internetEndPax}
                </td>
                <td className="px-3 py-2 text-slate-600">{row.membershipType}</td>
                <td className="px-3 py-2 text-right font-mono text-slate-700">{row.usageAmountMB} MB</td>
                <td className="px-3 py-2 text-center">
                     <span className="text-green-600 font-bold">{row.successfulPurchases}</span> / <span className={row.failedPurchases > 0 ? "text-red-600 font-bold" : "text-slate-300"}>{row.failedPurchases}</span>
                </td>
                <td className="px-3 py-2">
                    {row.failureReason !== 'Yok' ? <span className="text-red-500 px-1 bg-red-50 rounded">{row.failureReason}</span> : '-'}
                </td>
                <td className="px-3 py-2">
                     <span className={`px-2 py-0.5 rounded-full text-[10px] ${row.packageAssignmentStatus === 'Başarılı' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {row.packageAssignmentStatus}
                     </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 border-t border-slate-200">
        {data.length > 100 ? `${data.length} kayıttan ilk 100 tanesi gösteriliyor.` : `${data.length} kayıt gösteriliyor.`}
      </div>
    </div>
  );
};

export default DetailedDataTable;