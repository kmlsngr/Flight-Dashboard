
import React from 'react';
import { DetailedFlightRecord } from '../types';
import { FileText, CreditCard, Box } from 'lucide-react';

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
            <h3 className="font-bold text-slate-700">Uçuş Bazlı İşlem Detay Raporu</h3>
            <span className="text-[10px] text-slate-500 bg-slate-200 px-2 py-1 rounded">Veri Eşleşmesi: flightId / userName</span>
        </div>
        {onExport && (
          <button 
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            Raporu Dışa Aktar
          </button>
        )}
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-[10px] whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
            {/* GRUP BAŞLIKLARI */}
            <tr className="bg-slate-100/50">
                <th colSpan={4} className="px-3 py-2 border-r border-slate-200 text-slate-400">Uçuş Bilgileri</th>
                <th colSpan={4} className="px-3 py-2 border-r border-slate-200 text-blue-600 bg-blue-50/30">
                    <div className="flex items-center gap-1"><CreditCard className="w-3 h-3"/> Satın Alma Verileri</div>
                </th>
                <th colSpan={4} className="px-3 py-2 text-emerald-600 bg-emerald-50/30">
                    <div className="flex items-center gap-1"><Box className="w-3 h-3"/> Paket Atama Verileri</div>
                </th>
            </tr>
            <tr className="border-b border-slate-200">
              <th className="px-3 py-3">Saat</th>
              <th className="px-3 py-3">Uçuş ID</th>
              <th className="px-3 py-3">Kuyruk</th>
              <th className="px-3 py-3 border-r border-slate-200">Rota</th>
              
              {/* Satın Alım Sütunları */}
              <th className="px-3 py-3 bg-blue-50/20">Durum</th>
              <th className="px-3 py-3 bg-blue-50/20 text-center">Başarılı/Hata</th>
              <th className="px-3 py-3 bg-blue-50/20">Hata Nedeni</th>
              <th className="px-3 py-3 bg-blue-50/20 border-r border-slate-200">Ödeme Yöntemi</th>

              {/* Atama Sütunları */}
              <th className="px-3 py-3 bg-emerald-50/20">Paket İsmi</th>
              <th className="px-3 py-3 bg-emerald-50/20">Atama Durumu</th>
              <th className="px-3 py-3 bg-emerald-50/20 text-right">Kullanım (MB)</th>
              <th className="px-3 py-3 bg-emerald-50/20">Atama Hata Mesajı</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.slice(0, 100).map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 py-2 font-bold text-slate-700">{row.timeHour}. Saat</td>
                <td className="px-3 py-2 text-blue-600">{row.flightId}</td>
                <td className="px-3 py-2 text-slate-600 font-mono">{row.kuyrukNumarasi}</td>
                <td className="px-3 py-2 text-slate-500 border-r border-slate-200">{row.origin}-{row.destination}</td>
                
                {/* Satın Alma Hücreleri */}
                <td className="px-3 py-2 bg-blue-50/10">
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${row.purchaseStatus === 'Başarılı' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {row.purchaseStatus}
                    </span>
                </td>
                <td className="px-3 py-2 text-center bg-blue-50/10">
                    <span className="text-green-600 font-bold">{row.successfulPurchases}</span> / <span className="text-red-600">{row.failedPurchases}</span>
                </td>
                <td className="px-3 py-2 bg-blue-50/10 text-red-500 italic">
                    {row.failureReason !== 'Yok' ? row.failureReason : '-'}
                </td>
                <td className="px-3 py-2 bg-blue-50/10 border-r border-slate-200 text-slate-600 font-medium">
                    {row.paymentMethod}
                </td>

                {/* Paket Atama Hücreleri */}
                <td className="px-3 py-2 bg-emerald-50/10 font-medium">{row.packageName}</td>
                <td className="px-3 py-2 bg-emerald-50/10">
                     <span className={`px-2 py-0.5 rounded-full text-[9px] ${row.packageAssignmentStatus === 'Başarılı' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {row.packageAssignmentStatus}
                     </span>
                </td>
                <td className="px-3 py-2 bg-emerald-50/10 text-right font-mono font-bold text-slate-700">{row.packageUsageMB} MB</td>
                <td className="px-3 py-2 bg-emerald-50/10 text-slate-400 italic">
                    {row.failedAssignmentReason || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailedDataTable;
