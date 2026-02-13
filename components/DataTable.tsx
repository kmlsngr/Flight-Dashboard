import React from 'react';
import { FlightRecord } from '../types';

interface DataTableProps {
  data: FlightRecord[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mt-6 print:mt-10">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-bold text-slate-700">Detaylı Uçuş Verileri</h3>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Tarih</th>
              <th className="px-4 py-3">Bölge</th>
              <th className="px-4 py-3">Kuyruk</th>
              <th className="px-4 py-3">Saha</th>
              <th className="px-4 py-3">Tip</th>
              <th className="px-4 py-3">Kabin</th>
              <th className="px-4 py-3 text-right">Bağ. Yolcu</th>
              <th className="px-4 py-3">Üyelik</th>
              <th className="px-4 py-3">Login</th>
              <th className="px-4 py-3">İnternet Kul.</th>
              <th className="px-4 py-3">Paket</th>
              <th className="px-4 py-3">Aylık Kırılım</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.slice(0, 100).map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2 font-medium text-slate-700">{row.tarih}</td>
                <td className="px-4 py-2 text-slate-600">{row.bolge}</td>
                <td className="px-4 py-2 text-blue-600 font-mono">{row.kuyrukNumarasi}</td>
                <td className="px-4 py-2 text-slate-600">{row.ucusSahasi}</td>
                <td className="px-4 py-2 text-slate-600">{row.ucusTipi}</td>
                <td className="px-4 py-2 text-slate-600">{row.kabinTipi}</td>
                <td className="px-4 py-2 text-right font-bold text-green-700">{row.baglananYolcuSayisi}</td>
                <td className="px-4 py-2 text-slate-600">{row.uyelikTipi}</td>
                <td className="px-4 py-2 text-slate-600">{row.loginTipi}</td>
                <td className="px-4 py-2 text-slate-600">
                  <span className={`px-2 py-1 rounded-full text-[10px] 
                    ${row.internetKullanimDagilimi.includes('Yüksek') ? 'bg-purple-100 text-purple-700' : 
                      row.internetKullanimDagilimi.includes('Orta') ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>
                    {row.internetKullanimDagilimi}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-600">{row.satinAlinanPaketTuru}</td>
                <td className="px-4 py-2 text-slate-400">{row.aylikOrtKirilim}</td>
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

export default DataTable;