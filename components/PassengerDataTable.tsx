
import React from 'react';
import { PassengerAnalysisRecord } from '../types';
import { FileText, ShieldCheck, CreditCard, Box, User } from 'lucide-react';

interface PassengerDataTableProps {
  data: PassengerAnalysisRecord[];
  onExport?: () => void;
}

const PassengerDataTable: React.FC<PassengerDataTableProps> = ({ data, onExport }) => {
  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mt-6">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Yolcu Bazlı Konsolide Veri Listesi
            </h3>
            <span className="text-[10px] text-slate-500 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                Eşleşme: {data.length} Yolcu
            </span>
        </div>
        {onExport && (
          <button 
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-[11px] font-bold transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            Excel Aktar
          </button>
        )}
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-[10px] whitespace-nowrap">
          <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
            {/* GRUPLANMIŞ BAŞLIKLAR */}
            <tr className="bg-slate-200/50">
              <th colSpan={3} className="px-3 py-2 border-r border-slate-300 text-slate-500"><div className="flex items-center gap-1"><User className="w-3 h-3"/> Yolcu & Kimlik</div></th>
              <th colSpan={4} className="px-3 py-2 border-r border-slate-300 text-blue-600 bg-blue-50/50"><div className="flex items-center gap-1"><CreditCard className="w-3 h-3"/> Satın Alım (Payment Channel)</div></th>
              <th colSpan={5} className="px-3 py-2 text-emerald-600 bg-emerald-50/50"><div className="flex items-center gap-1"><Box className="w-3 h-3"/> Paket Atama & Kullanım (DPI)</div></th>
            </tr>
            <tr className="uppercase">
              <th className="px-3 py-3 w-32 bg-slate-100">User Name</th>
              <th className="px-3 py-3 w-40">Ad Soyad</th>
              <th className="px-3 py-3 w-32 border-r border-slate-300">MAC</th>
              
              {/* Satın Alma */}
              <th className="px-3 py-3 bg-blue-50">Durum</th>
              <th className="px-3 py-3 bg-blue-50">Yöntem</th>
              <th className="px-3 py-3 bg-blue-50">Hata Nedeni</th>
              <th className="px-3 py-3 bg-blue-50 border-r border-slate-300 text-center">Hata Sayısı</th>

              {/* Paket Atama */}
              <th className="px-3 py-3 bg-emerald-50">Paket İsmi</th>
              <th className="px-3 py-3 bg-emerald-50">Atama Durumu</th>
              <th className="px-3 py-3 bg-emerald-50 text-right">Veri (MB)</th>
              <th className="px-3 py-3 bg-emerald-50">Uygulama</th>
              <th className="px-3 py-3 bg-emerald-50 text-center">Session</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.slice(0, 100).map((row) => (
              <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-3 py-2 font-mono text-blue-600">{row.userName}</td>
                <td className="px-3 py-2 font-bold text-slate-700">{row.name} {row.surname}</td>
                <td className="px-3 py-2 font-mono text-slate-400 border-r border-slate-300">{row.mac}</td>
                
                {/* Satın Alma Verileri */}
                <td className="px-3 py-2 bg-blue-50/10">
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${row.purchaseStatus === 'Başarılı' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {row.purchaseStatus}
                    </span>
                </td>
                <td className="px-3 py-2 bg-blue-50/10 text-slate-600 font-medium">{row.paymentMethod}</td>
                <td className="px-3 py-2 bg-blue-50/10 text-red-500 italic">{row.failedPurchaseReason !== 'Yok' ? row.failedPurchaseReason : '-'}</td>
                <td className="px-3 py-2 bg-blue-50/10 border-r border-slate-300 text-center font-bold">{row.failedPurchaseCount}</td>

                {/* Paket Atama Verileri */}
                <td className="px-3 py-2 bg-emerald-50/10 font-bold text-slate-700">{row.usedPackageName}</td>
                <td className="px-3 py-2 bg-emerald-50/10">
                     <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${row.packageAssignmentStatus === 'Başarılı' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {row.packageAssignmentStatus}
                    </span>
                </td>
                <td className="px-3 py-2 bg-emerald-50/10 text-right font-bold text-blue-600">{row.dataUsageMB} MB</td>
                <td className="px-3 py-2 bg-emerald-50/10 text-slate-600">{row.usedAppName}</td>
                <td className="px-3 py-2 bg-emerald-50/10 text-center font-bold text-slate-500">{row.sessionCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PassengerDataTable;
