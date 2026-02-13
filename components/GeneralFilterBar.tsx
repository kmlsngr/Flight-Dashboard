
import React, { useState } from 'react';
import { GeneralFilterState, UcusTipi } from '../types';
import { OPTIONS } from '../constants';
import { Filter, CheckSquare, Square, ChevronDown, ChevronUp } from 'lucide-react';

interface GeneralFilterBarProps {
  filters: GeneralFilterState;
  setFilters: React.Dispatch<React.SetStateAction<GeneralFilterState>>;
}

const GeneralFilterBar: React.FC<GeneralFilterBarProps> = ({ filters, setFilters }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleMultiSelect = <T extends string>(key: keyof GeneralFilterState, value: T) => {
    setFilters(prev => {
      const current = prev[key] as T[];
      if (current.includes(value)) return { ...prev, [key]: current.filter(item => item !== value) };
      return { ...prev, [key]: [...current, value] };
    });
  };

  const handleSelectAll = <T extends string>(key: keyof GeneralFilterState, allValues: T[]) => {
    setFilters(prev => {
      const current = prev[key] as T[];
      if (current.length === allValues.length) return { ...prev, [key]: [] };
      return { ...prev, [key]: allValues };
    });
  };

  const isSelected = <T extends string>(key: keyof GeneralFilterState, value: T) => {
    return (filters[key] as T[]).includes(value);
  };

  const renderMultiSelect = <T extends string>(label: string, key: keyof GeneralFilterState, options: T[]) => {
    const selectedCount = (filters[key] as T[]).length;
    const isAllSelected = selectedCount === options.length;

    return (
      <div className="min-w-[200px] mb-4">
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase truncate" title={label}>{label}</label>
        <div className="relative group">
            <div className="flex items-center justify-between border rounded p-1.5 bg-white text-xs text-slate-700 cursor-pointer">
              <span>{isAllSelected ? 'Tümü Seçili' : `${selectedCount} Seçili`}</span>
              <span className="text-[10px] text-slate-400">▼</span>
            </div>
            
            <div className="hidden group-hover:block absolute top-full left-0 w-64 bg-white border shadow-xl z-20 p-2 rounded-b max-h-60 overflow-y-auto">
              <button
                onClick={() => handleSelectAll(key, options)}
                className="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-slate-50 text-xs font-bold mb-1 border-b text-slate-700"
              >
                {isAllSelected ? <CheckSquare className="w-3 h-3 text-blue-600"/> : <Square className="w-3 h-3"/>}
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
          <h2 className="font-bold text-slate-800">Genel Filtreler</h2>
          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium ml-2">
            {isCollapsed ? 'Gizli' : 'Görünür'}
          </span>
        </div>
        {isCollapsed ? <ChevronDown className="h-5 w-5 text-slate-400" /> : <ChevronUp className="h-5 w-5 text-slate-400" />}
      </div>

      {!isCollapsed && (
        <div className="p-4 border-t border-slate-100 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Tarih Aralığı</label>
                <div className="flex gap-2">
                    <input type="date" value={filters.startDate} min="2025-01-01" max="2025-12-31" onChange={(e) => setFilters(prev => ({...prev, startDate: e.target.value}))} className="w-full text-xs border border-slate-300 rounded p-1.5 focus:ring-1 outline-none text-slate-700 bg-white"/>
                    <input type="date" value={filters.endDate} min="2025-01-01" max="2025-12-31" onChange={(e) => setFilters(prev => ({...prev, endDate: e.target.value}))} className="w-full text-xs border border-slate-300 rounded p-1.5 focus:ring-1 outline-none text-slate-700 bg-white"/>
                </div>
            </div>
            
            {renderMultiSelect('Bölge', 'bolge', OPTIONS.BOLGE)}
            {renderMultiSelect('Kuyruk Numarası', 'kuyrukNumarasi', OPTIONS.KUYRUK)}
            {renderMultiSelect('Uçuş Sahası', 'ucusSahasi', OPTIONS.UCUS_SAHASI)}
            
            <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Uçuş Tipi</label>
                <select value={filters.ucusTipi || ''} onChange={(e) => setFilters(prev => ({...prev, ucusTipi: e.target.value ? e.target.value as UcusTipi : null}))} className="w-full text-xs border border-slate-300 rounded p-1.5 text-slate-700 bg-white">
                    <option value="">Tümü</option>
                    {OPTIONS.UCUS_TIPI.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {renderMultiSelect('Kabin Tipi', 'kabinTipi', OPTIONS.KABIN_TIPI)}
            {renderMultiSelect('M&S Üyelik', 'uyelikTipi', OPTIONS.UYELIK)}
            {renderMultiSelect('Login Tipi', 'loginTipi', OPTIONS.LOGIN)}
            {renderMultiSelect('Paket Türü', 'satinAlinanPaketTuru', OPTIONS.PAKET)}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralFilterBar;
