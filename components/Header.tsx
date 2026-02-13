
import React from 'react';
import { Download, FileText, Plane, LayoutDashboard, Activity, Smartphone, Users } from 'lucide-react';

interface HeaderProps {
  activePage: 'general' | 'detailed' | 'appUsage' | 'passengerAnalysis';
  setActivePage: (page: 'general' | 'detailed' | 'appUsage' | 'passengerAnalysis') => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

const Header: React.FC<HeaderProps> = ({ activePage, setActivePage, onExportExcel, onExportPDF }) => {

  return (
    <header className="bg-slate-900 text-white shadow-lg print:hidden sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 pb-0">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Genel Durum Bildirme Raporu</h1>
              <p className="text-slate-400 text-xs">2025 Yılı İnternet ve Yolcu Analizi</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4 md:mb-0">
            <button 
              onClick={onExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 rounded-md text-sm font-medium transition-colors"
            >
              <FileText className="h-4 w-4" />
              Excel
            </button>
            <button 
              onClick={onExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md text-sm font-medium transition-colors"
            >
              <Download className="h-4 w-4" />
              PDF
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 px-4 mt-2 overflow-x-auto">
          <button
            onClick={() => setActivePage('general')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-lg transition-colors border-t border-l border-r whitespace-nowrap
              ${activePage === 'general' 
                ? 'bg-[#f3f4f6] text-blue-700 border-slate-200 border-b-[#f3f4f6] relative top-[1px]' 
                : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Genel Durum (Page 1)
          </button>
          <button
            onClick={() => setActivePage('detailed')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-lg transition-colors border-t border-l border-r whitespace-nowrap
              ${activePage === 'detailed' 
                ? 'bg-[#f3f4f6] text-blue-700 border-slate-200 border-b-[#f3f4f6] relative top-[1px]' 
                : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'}`}
          >
            <Activity className="h-4 w-4" />
            Uçuş Bazlı Detay (Page 2)
          </button>
          <button
            onClick={() => setActivePage('appUsage')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-lg transition-colors border-t border-l border-r whitespace-nowrap
              ${activePage === 'appUsage' 
                ? 'bg-[#f3f4f6] text-blue-700 border-slate-200 border-b-[#f3f4f6] relative top-[1px]' 
                : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'}`}
          >
            <Smartphone className="h-4 w-4" />
            Uçuş Bazlı Veri Kullanımı (Page 3)
          </button>
          <button
            onClick={() => setActivePage('passengerAnalysis')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-lg transition-colors border-t border-l border-r whitespace-nowrap
              ${activePage === 'passengerAnalysis' 
                ? 'bg-[#f3f4f6] text-blue-700 border-slate-200 border-b-[#f3f4f6] relative top-[1px]' 
                : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'}`}
          >
            <Users className="h-4 w-4" />
            Yolcu Bazlı Detay (Page 4)
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
