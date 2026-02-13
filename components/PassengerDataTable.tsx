import React from 'react';
import { PassengerAnalysisRecord } from '../types';
import { FileText, Monitor, ShieldCheck, CreditCard, Clock } from 'lucide-react';

interface PassengerDataTableProps {
  data: PassengerAnalysisRecord[];
  onExport?: () => void;
}

const PassengerDataTable: React.FC<PassengerDataTableProps> = ({ data, onExport }) => {
  
  // Mask sensitive info for security (Passport and ID)
  const maskSensitive = (str: string, visibleStart = 2, visibleEnd = 2) => {
    if (!str) return '';
    if (str.length <= (visibleStart + visibleEnd)) return '*'.repeat(str.length);
    const start = str.substring(0, visibleStart);
    const end = str.substring(str.length - visibleEnd);
    const mid = '*'.repeat(str.length - (visibleStart + visibleEnd));
    return `${start}${mid}${end}`;
  };

  if (data.length === 0) return (
    <div className="bg-white p-8 text-center text-slate-400 border border-dashed rounded-lg">
      Filtrelere uygun yolcu verisi bulunamadı.
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mt-6">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Yolcu Bazlı Detaylı Aktivite Listesi (DPI & Analiz)
            </h3>
            <span className="text-[10px] text-slate-500 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                {data.length} Kayıt
            </span>
        </div>
        {onExport && (
          <button 
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-[11px] font-bold transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            Excel Aktar (Full Dataset)
          </button>
        )}
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-[10px] whitespace-nowrap table-fixed">
          <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10">
            <tr className="uppercase tracking-tighter">
              <th className="px-3 py-3 w-32 bg-slate-100 sticky left-0 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">Time</th>
              <th className="px-3 py-3 w-56 bg-slate-100">User Name</th>
              <th className="px-3 py-3 w-40">Name Surname</th>
              <th className="px-3 py-3 w-32">IP / MAC</th>
              <th className="px-3 py-3 w-20 text-center">Nationality</th>
              <th className="px-3 py-3 w-40">Passport / Identity</th>
              <th className="px-3 py-3 w-32">Flight Id / Kuyruk</th>
              <th className="px-3 py-3 w-40">Uçuş No / Tarih</th>
              <th className="px-3 py-3 w-32 text-center">Origin - Dest</th>
              <th className="px-3 py-3 w-24">Kabin Tipi</th>
              <th className="px-3 py-3 w-24">User Segment</th>
              <th className="px-3 py-3 w-24">Uçuş Sahası</th>
              <th className="px-3 py-3 w-24">Uçuş Tipi</th>
              <th className="px-3 py-3 w-32">Session Baş./Bit.</th>
              <th className="px-3 py-3 w-32 text-center">Bağlantı Başarı</th>
              <th className="px-3 py-3 w-32">İnt. Kul. Baş./Bit.</th>
              <th className="px-3 py-3 w-24 text-center">Satınalım Durum</th>
              <th className="px-3 py-3 w-32">Başarısız Satınalım N.</th>
              <th className="px-3 py-3 w-24">Ödeme Yöntemi</th>
              <th className="px-3 py-3 w-32">Kullanılan Paket</th>
              <th className="px-3 py-3 w-32">Paket Baş. Zamanı</th>
              <th className="px-3 py-3 w-24 text-right">Veri Kul. (MB)</th>
              <th className="px-3 py-3 w-24">Uygulama Adı</th>
              <th className="px-3 py-3 w-24 text-center">Session Sayısı</th>
              <th className="px-3 py-3 w-24 text-center">Kullanım Durumu</th>
              <th className="px-3 py-3 w-24 text-center">Login Sayısı</th>
              <th className="px-3 py-3 w-24 text-center">Hatalı Satınalım S.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.slice(0, 500).map((row) => (
              <tr key={row.id} className="hover:bg-blue-50/50 transition-colors">
                {/* 1. Time (Sticky) */}
                <td className="px-3 py-2 font-bold text-slate-800 bg-white sticky left-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                   <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Uçuşun {row.timeHour}. Saati
                   </div>
                </td>
                
                {/* 2. User Name */}
                <td className="px-3 py-2 text-blue-600 font-mono text-[9px] truncate max-w-[200px]" title={row.userName}>
                    {row.userName}
                </td>

                {/* 3. Name Surname */}
                <td className="px-3 py-2 font-bold text-slate-700">
                    {row.name} {row.surname}
                </td>

                {/* 4. IP/MAC */}
                <td className="px-3 py-2">
                    <div className="font-mono text-slate-500">{row.ip}</div>
                    <div className="font-mono text-[8px] text-slate-400">{row.mac}</div>
                </td>

                {/* 5. Nationality */}
                <td className="px-3 py-2 text-center font-bold text-slate-600">{row.nationality}</td>

                {/* 6. Passport / Identity */}
                <td className="px-3 py-2">
                    <div className="text-slate-500">P: {maskSensitive(row.passportNumber)}</div>
                    <div className="text-slate-400">T: {maskSensitive(row.identityNumber, 3, 2)}</div>
                </td>

                {/* 7. Flight Id / Kuyruk */}
                <td className="px-3 py-2">
                    <div className="font-bold text-slate-800">{row.flightId}</div>
                    <div className="text-[9px] text-slate-400 font-mono">{row.kuyrukNumarasi}</div>
                </td>

                {/* 8. Uçuş No / Tarih */}
                <td className="px-3 py-2">
                    <div className="font-medium">{row.ucusNumarasi}</div>
                    <div className="text-[9px] text-slate-400">{row.ucusTarihi}</div>
                </td>

                {/* 9. Origin - Dest */}
                <td className="px-3 py-2 text-center">
                    <span className="font-bold text-slate-700">{row.origin}</span>
                    <span className="mx-1 text-slate-300">→</span>
                    <span className="font-bold text-slate-700">{row.destination}</span>
                </td>

                {/* 10. Kabin Tipi */}
                <td className="px-3 py-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${row.kabinTipi === 'Business' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                        {row.kabinTipi}
                    </span>
                </td>

                {/* 11. User Segment */}
                <td className="px-3 py-2 font-bold text-blue-600">{row.userSegment}</td>

                {/* 12. Uçuş Sahası */}
                <td className="px-3 py-2 text-slate-600">{row.ucusSahasi}</td>

                {/* 13. Uçuş Tipi */}
                <td className="px-3 py-2 text-slate-600">{row.ucusTipi}</td>

                {/* 14. Session Start/End */}
                <td className="px-3 py-2 text-slate-500">
                    <div>B: {row.sessionStart}</div>
                    <div>S: {row.sessionEnd}</div>
                </td>

                {/* 15. Connection Status */}
                <td className="px-3 py-2 text-center">
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${row.connectionStatus === 'Başarılı' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {row.connectionStatus}
                    </span>
                </td>

                {/* 16. Usage Start/End */}
                <td className="px-3 py-2 text-slate-400">
                    <div>B: {row.internetUsageStart}</div>
                    <div>S: {row.internetUsageEnd}</div>
                </td>

                {/* 17. Purchase Status */}
                <td className="px-3 py-2 text-center">
                    {row.purchaseStatus === 'Yok' ? '-' : (
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${row.purchaseStatus === 'Başarılı' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {row.purchaseStatus}
                        </span>
                    )}
                </td>

                {/* 18. Failed Reason */}
                <td className="px-3 py-2 text-rose-400 text-[9px] italic">
                    {row.failedPurchaseReason !== 'Yok' ? row.failedPurchaseReason : '-'}
                </td>

                {/* 19. Payment Method */}
                <td className="px-3 py-2 text-slate-600">{row.paymentMethod}</td>

                {/* 20. Used Package */}
                <td className="px-3 py-2 font-medium text-slate-700">{row.usedPackageName}</td>

                {/* 21. Package Start Time */}
                <td className="px-3 py-2 text-slate-500">{row.packageStartTime}</td>

                {/* 22. Usage MB (DPI) */}
                <td className="px-3 py-2 text-right">
                    <span className={`font-bold ${row.dataUsageMB > 100 ? 'text-blue-700' : 'text-slate-600'}`}>
                        {row.dataUsageMB} MB
                    </span>
                </td>

                {/* 23. App Name */}
                <td className="px-3 py-2">
                    {row.usedAppName !== 'N/A' ? (
                        <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-medium">
                            <Monitor className="w-3 h-3 text-slate-400" />
                            {row.usedAppName}
                        </span>
                    ) : <span className="text-slate-300">N/A</span>}
                </td>

                {/* 24. Session Count */}
                <td className="px-3 py-2 text-center font-bold text-slate-600">{row.sessionCount}</td>

                {/* 25. Internet Usage Status (Count) */}
                <td className="px-3 py-2 text-center font-bold text-slate-600">{row.internetUsageStatus}</td>

                {/* 26. Login Count */}
                <td className="px-3 py-2 text-center font-bold text-slate-600">{row.loginCount}</td>

                {/* 27. Failed Purchase Count */}
                <td className="px-3 py-2 text-center font-bold text-rose-600">{row.failedPurchaseCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 font-bold text-center uppercase">
        {data.length > 500 ? `${data.length} kayıttan ilk 500 tanesi listelenmektedir.` : `Toplam ${data.length} kayıt listelendi.`}
      </div>
    </div>
  );
};

export default PassengerDataTable;
