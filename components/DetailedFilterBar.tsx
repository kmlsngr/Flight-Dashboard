import React, { useState } from 'react';
import { DetailedFilterState, UcusTipi } from '../types';
import { OPTIONS } from '../constants';
import { Filter, CheckSquare, Square, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface DetailedFilterBarProps {
  filters: DetailedFilterState;
  setFilters: React.Dispatch<React.SetStateAction<DetailedFilterState>>;
}

const DetailedFilterBar: React.FC<DetailedFilterBarProps> = ({ filters, setFilters }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleMultiSelect = <T extends string>(key: keyof DetailedFilterState, value: T) => {
    setFilters(prev => {
      const current = prev[key] as T[];
      if (current.includes(value)) return { ...prev, [key]: current.filter(item => item !== value) };
      return { ...prev, [key]: [...current, value] };
    });
  };

  const handleSelectAll = <T extends string>(key: keyof DetailedFilterState, allValues: T[]) => {
    setFilters(prev => {
      const current = prev[key] as T[];
      if (current.length === allValues.length) return { ...prev, [key]: [] };
      return { ...prev, [key]: allValues };
    });
  };

  const isSelected = <T extends string>(key: keyof DetailedFilterState, value: T) => {
    return (filters[key] as T[]).includes(value);
  };

  const renderMultiSelect = <T extends string>(label: string, key: keyof DetailedFilterState, options: T[], danger = false) => {
    const selectedCount = (filters[key] as T[]).length;
    const isAllSelected = selectedCount === options.length;

    return (
      <div className="min-w-[150px] mb-2">
        <label className={`block text-[10px] font-bold mb-1 uppercase truncate ${danger ? 'text-red-500' : 'text-slate-500'}`} title={label}>{label}</label>
        <div className="relative group">
            <div className={`flex items-center justify-between border rounded p-1.5 bg-white text-xs cursor-pointer ${danger ? 'border-red-200 hover:border-red-400' : 'border-slate-200'}`}>
              <span className={danger ? 'text-red-700' : 'text-slate-700'}>{isAllSelected ? 'Tümü' : `${selectedCount} Seçili`}</span>
              <span className="text-[10px] text-slate-400">▼</span>
            </div>
            
            <div className="hidden group-hover:block absolute top-full left-0 w-56 bg-white border shadow-xl z-20 p-2 rounded-b max-h-60 overflow-y-auto">
              <button
                onClick={() => handleSelectAll(key, options)}
                className="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-slate-50 text-xs font-bold mb-1 border-b text-slate-700"
              >
                {isAllSelected ? <CheckSquare className="w-3 h-3 text-blue-600"/> : <Square className="w-3 h-3 text-slate-400"/>}
                Tümünü Seç
              </button>
              {options.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleMultiSelect(key, opt)}
                  className="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-slate-50 text-xs text-slate-700"
                >
                   {isSelected(key, opt) ? <CheckSquare className={`w-3 h-3 ${danger ? 'text-red-600' : 'text-blue-600'}`}/> : <Square className="w-3 h-3 text-slate-300"/>}
                   <span className="truncate">{opt}</span>
                </button>
              ))}
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6 print:hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2 text-slate-800">
          <Filter className="h-5 w-5 text-blue-600" />
          <h2 className="font-bold text-slate-800">Uçuş Bazlı Detay Filtreleri</h2>
          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium ml-2">
            {isCollapsed ? 'Gizli' : 'Görünür'}
          </span>
        </div>
        {isCollapsed ? <ChevronDown className="h-5 w-5 text-slate-400" /> : <ChevronUp className="h-5 w-5 text-slate-400" />}
      </div>

      {!isCollapsed && (
        <div className="p-4 border-t border-slate-100 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="col-span-2 md:col-span-2">
                 <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Tarih</label>
                <div className="flex gap-1">
                    <input type="date" value={filters.startDate} min="2025-01-01" max="2025-12-31" onChange={(e) => setFilters(prev => ({...prev, startDate: e.target.value}))} className="w-full text-xs border border-slate-300 rounded p-1.5 text-slate-700 bg-white"/>
                    <input type="date" value={filters.endDate} min="2025-01-01" max="2025-12-31" onChange={(e) => setFilters(prev => ({...prev, endDate: e.target.value}))} className="w-full text-xs border border-slate-300 rounded p-1.5 text-slate-700 bg-white"/>
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Uçuş ID</label>
                <select 
                  value={filters.flightId} 
                  onChange={(e) => setFilters(prev => ({...prev, flightId: e.target.value}))} 
                  className="w-full text-xs border border-slate-300 rounded p-1.5 text-slate-700 bg-white"
                >
                  <option value="">Tümü</option>
                  {OPTIONS.FLIGHT_IDS.map(id => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </select>
            </div>
            
            <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Uçuş Saati</label>
                <select 
                  value={filters.timeHour || ''} 
                  onChange={(e) => setFilters(prev => ({...prev, timeHour: e.target.value ? parseInt(e.target.value) : null}))} 
                  className="w-full text-xs border border-slate-300 rounded p-1.5 text-slate-700 bg-white"
                >
                  <option value="">Tümü</option>
                  {OPTIONS.HOURS.map(h => (
                    <option key={h} value={h}>{h}. Saat</option>
                  ))}
                </select>
            </div>

            {renderMultiSelect('Bölge', 'bolge', OPTIONS.BOLGE)}
            {renderMultiSelect('Kuyruk', 'kuyrukNumarasi', OPTIONS.KUYRUK)}
            {renderMultiSelect('Origin', 'origin', OPTIONS.ORIGINS)}
            {renderMultiSelect('Destination', 'destination', OPTIONS.DESTINATIONS)}
            {renderMultiSelect('Uygulama', 'appType', OPTIONS.APP_TYPES)}
            {renderMultiSelect('Ödeme Yöntemi', 'paymentMethod', OPTIONS.PAYMENT_METHODS)}
            {renderMultiSelect('Paket', 'purchasedPackage', OPTIONS.PAKET)}
            
            <div className="col-span-2 md:col-span-6 lg:col-span-6 mt-2 pt-2 border-t border-red-100 bg-red-50 p-2 rounded">
                 <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-red-700">Hata Analizi Filtreleri</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     {renderMultiSelect('Başarısızlık Nedeni', 'failureReason', OPTIONS.FAILURE_REASONS, true)}
                     {renderMultiSelect('Paket Atama Durumu', 'packageAssignmentStatus', OPTIONS.ASSIGNMENT_STATUS, true)}
                 </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedFilterBar;