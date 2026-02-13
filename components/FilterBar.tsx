
import React, { useState } from 'react';
import { FilterState, Bolge, UcusSahasi, UcusTipi, KabinTipi, UyelikTipi, LoginTipi, PaketTuru } from '../types';
import { OPTIONS } from '../constants';
import { Filter, ChevronDown, ChevronUp, CheckSquare, Square } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  const [openSections, setOpenSections] = useState({
    global: true,
    operational: false,
    passenger: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleMultiSelect = <T extends string>(
    key: keyof FilterState,
    value: T
  ) => {
    setFilters(prev => {
      const current = prev[key] as T[];
      if (Array.isArray(current)) {
          if (current.includes(value)) {
            return { ...prev, [key]: current.filter(item => item !== value) };
          } else {
            return { ...prev, [key]: [...current, value] };
          }
      }
      return prev;
    });
  };

  const handleSelectAll = <T extends string>(
    key: keyof FilterState,
    allValues: T[]
  ) => {
    setFilters(prev => {
      const current = prev[key] as T[];
       if (Array.isArray(current)) {
          if (current.length === allValues.length) {
            return { ...prev, [key]: [] };
          } else {
            return { ...prev, [key]: allValues };
          }
       }
       return prev;
    });
  };

  const isSelected = <T extends string>(key: keyof FilterState, value: T) => {
     const current = filters[key];
     if(Array.isArray(current)) {
         return (current as T[]).includes(value);
     }
     return false;
  };

  const renderMultiSelect = <T extends string>(
    label: string,
    key: keyof FilterState,
    options: T[]
  ) => {
    const current = filters[key];
    const selectedCount = Array.isArray(current) ? current.length : 0;
    const isAllSelected = selectedCount === options.length;

    return (
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">{label}</label>
        <div className="flex flex-wrap gap-2">
           <button
            onClick={() => handleSelectAll(key, options)}
            className={`text-xs px-2 py-1 rounded border transition-colors flex items-center gap-1
              ${isAllSelected ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {isAllSelected ? <CheckSquare className="w-3 h-3"/> : <Square className="w-3 h-3"/>}
            Tümü
          </button>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => handleMultiSelect(key, opt)}
              className={`text-xs px-2 py-1 rounded border transition-colors
                ${isSelected(key, opt) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 print:hidden">
      <div className="flex items-center gap-2 mb-4 text-slate-800 border-b pb-2">
        <Filter className="h-5 w-5 text-blue-600" />
        <h2 className="font-bold">Filtreler</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GLOBAL FILTERS */}
        <div className="border-r border-slate-100 pr-4">
          <button 
            onClick={() => toggleSection('global')} 
            className="flex items-center justify-between w-full mb-3 group"
          >
            <h3 className="text-sm font-bold text-slate-700 group-hover:text-blue-600">Global Filtreler</h3>
            {openSections.global ? <ChevronUp className="h-4 w-4 text-slate-400"/> : <ChevronDown className="h-4 w-4 text-slate-400"/>}
          </button>
          
          {openSections.global && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Tarih Aralığı</label>
                <div className="flex gap-2">
                  <input 
                    type="date" 
                    value={filters.startDate}
                    min="2025-01-01" max="2025-12-31"
                    onChange={(e) => setFilters(prev => ({...prev, startDate: e.target.value}))}
                    className="w-full text-sm border border-slate-300 rounded p-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input 
                    type="date" 
                    value={filters.endDate}
                    min="2025-01-01" max="2025-12-31"
                    onChange={(e) => setFilters(prev => ({...prev, endDate: e.target.value}))}
                    className="w-full text-sm border border-slate-300 rounded p-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {renderMultiSelect('Bölge', 'bolge', OPTIONS.BOLGE)}
              {renderMultiSelect('Uçuş Sahası', 'ucusSahasi', OPTIONS.UCUS_SAHASI)}
              {renderMultiSelect('Kabin Tipi', 'kabinTipi', OPTIONS.KABIN_TIPI)}
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Uçuş Tipi</label>
                <select 
                  value={filters.ucusTipi || ''}
                  onChange={(e) => setFilters(prev => ({...prev, ucusTipi: e.target.value ? e.target.value as UcusTipi : null}))}
                  className="w-full text-sm border border-slate-300 rounded p-1.5"
                >
                  <option value="">Tümü</option>
                  {OPTIONS.UCUS_TIPI.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* OPERATIONAL FILTERS */}
        <div className="border-r border-slate-100 pr-4">
          <button 
            onClick={() => toggleSection('operational')} 
            className="flex items-center justify-between w-full mb-3 group"
          >
            <h3 className="text-sm font-bold text-slate-700 group-hover:text-blue-600">Operasyonel Filtreler</h3>
            {openSections.operational ? <ChevronUp className="h-4 w-4 text-slate-400"/> : <ChevronDown className="h-4 w-4 text-slate-400"/>}
          </button>

          {openSections.operational && (
            <div className="space-y-4">
              {renderMultiSelect('Kuyruk Numarası', 'kuyrukNumarasi', OPTIONS.KUYRUK)}

               <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">
                  Bağlanan Yolcu Sayısı
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filters.minBaglananYolcu}
                    onChange={(e) => setFilters(prev => ({ ...prev, minBaglananYolcu: parseInt(e.target.value) || 0 }))}
                    className="w-full text-sm border border-slate-300 rounded p-1.5"
                    placeholder="Min"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    value={filters.maxBaglananYolcu}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxBaglananYolcu: parseInt(e.target.value) || 300 }))}
                    className="w-full text-sm border border-slate-300 rounded p-1.5"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* PASSENGER FILTERS */}
        <div>
          <button 
            onClick={() => toggleSection('passenger')} 
            className="flex items-center justify-between w-full mb-3 group"
          >
            <h3 className="text-sm font-bold text-slate-700 group-hover:text-blue-600">Yolcu & Kullanım</h3>
            {openSections.passenger ? <ChevronUp className="h-4 w-4 text-slate-400"/> : <ChevronDown className="h-4 w-4 text-slate-400"/>}
          </button>

          {openSections.passenger && (
            <div className="space-y-4">
              {renderMultiSelect('M&S Üyelik', 'uyelikTipi', OPTIONS.UYELIK)}
              {renderMultiSelect('Login Tipi', 'loginTipi', OPTIONS.LOGIN)}
              {renderMultiSelect('Paket Türü', 'satinAlinanPaketTuru', OPTIONS.PAKET)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FilterBar;
