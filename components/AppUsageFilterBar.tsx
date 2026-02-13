
import React, { useState } from 'react';
import { AppUsageFilterState, UcusTipi } from '../types';
import { OPTIONS } from '../constants';
import { Filter, CheckSquare, Square, ChevronDown, ChevronUp } from 'lucide-react';

interface AppUsageFilterBarProps {
  filters: AppUsageFilterState;
  setFilters: React.Dispatch<React.SetStateAction<AppUsageFilterState>>;
}

const AppUsageFilterBar: React.FC<AppUsageFilterBarProps> = ({ filters, setFilters }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleMultiSelect = <T extends string>(key: keyof AppUsageFilterState, value: T) => {
    setFilters(prev => {
      const current = prev[key] as T[];
      if (current.includes(value)) return { ...prev, [key]: current.filter(item => item !== value) };
      return { ...prev, [key]: [...current, value] };
    });
  };

  const handleSelectAll = <T extends string>(key: keyof AppUsageFilterState, allValues: T[]) => {
    setFilters(prev => {
      const current = prev[key] as T[];
      if (current.length === allValues.length) return { ...prev, [key]: [] };
      return { ...prev, [key]: allValues };
    });
  };

  const isSelected = <T extends string>(key: keyof AppUsageFilterState, value: T) => {
    return (filters[key] as T[]).includes(value);
  };

  const renderMultiSelect = <T extends string>(label: string, key: keyof AppUsageFilterState, options: T[]) => {
    const selectedCount = (filters[key] as T[]).length;
    const isAllSelected = selectedCount === options.length;

    return (
      <div className="min-w-[150px] mb-2">
        <label className="block text-[10px] font-bold mb-1 uppercase text-slate-500 truncate" title={label}>{label}</label>
        <div className="relative group">
            <div className="flex items-center justify-between border border-slate-200 rounded p-1.5 bg-white text-xs cursor-pointer">
              <span className="text-slate-700">{isAllSelected ? 'Tümü' : `${selectedCount} Seçili`}</span>
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
                   {isSelected(key, opt) ? <CheckSquare className="w-3 h-3 text-blue-600"/> : <Square className="w-3 h-3 text-slate-300"/>}
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
          <h2 className="font-bold text-slate-800">Uçuş Bazlı Veri Kullanımı Filtreleri</h2>
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
                 <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Uçuş Tarihi (Aralık)</label>
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
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Uçuş Numarası</label>
                <input 
                  type="text"
                  placeholder="örn: TK1234"
                  value={filters.ucusNumarasi} 
                  onChange={(e) => setFilters(prev => ({...prev, ucusNumarasi: e.target.value}))} 
                  className="w-full text-xs border border-slate-300 rounded p-1.5 text-slate-700 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>
            
            <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Zaman (Saat)</label>
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
            {renderMultiSelect('Uçuş Sahası', 'ucusSahasi', OPTIONS.UCUS_SAHASI)}
            {renderMultiSelect('Kuyruk No', 'kuyrukNumarasi', OPTIONS.KUYRUK)}
            {renderMultiSelect('Origin', 'origin', OPTIONS.ORIGINS)}
            {renderMultiSelect('Destination', 'destination', OPTIONS.DESTINATIONS)}
            {renderMultiSelect('Uygulama Türü', 'uygulamaTuru', OPTIONS.APP_TYPES)}
            
            <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Uçuş Tipi</label>
                <select 
                    value={filters.ucusTipi || ''} 
                    onChange={(e) => setFilters(prev => ({...prev, ucusTipi: e.target.value ? e.target.value as UcusTipi : null}))} 
                    className="w-full text-xs border border-slate-300 rounded p-1.5 text-slate-700 bg-white"
                >
                    <option value="">Tümü</option>
                    {OPTIONS.UCUS_TIPI.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppUsageFilterBar;
