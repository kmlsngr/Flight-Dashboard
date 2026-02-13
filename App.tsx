
import React, { useState, useMemo } from 'react';
import { MOCK_DATA, MOCK_DETAILED_DATA, MOCK_APP_USAGE_DATA, MOCK_PASSENGER_DATA } from './constants';
import { GeneralFilterState, DetailedFilterState, AppUsageFilterState, PassengerAnalysisFilterState } from './types';
import Header from './components/Header';
import GeneralFilterBar from './components/GeneralFilterBar';
import GeneralDashboardCharts from './components/GeneralDashboardCharts';
import GeneralDataTable from './components/GeneralDataTable';
import DetailedFilterBar from './components/DetailedFilterBar';
import DetailedDashboardCharts from './components/DetailedDashboardCharts';
import DetailedDataTable from './components/DetailedDataTable';
import AppUsageFilterBar from './components/AppUsageFilterBar';
import AppUsageDashboardCharts from './components/AppUsageDashboardCharts';
import AppUsageDataTable from './components/AppUsageDataTable';
import PassengerFilterBar from './components/PassengerFilterBar';
import PassengerDashboardCharts from './components/PassengerDashboardCharts';
import PassengerDataTable from './components/PassengerDataTable';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<'general' | 'detailed' | 'appUsage' | 'passengerAnalysis'>('general');

  // --- GENERAL PAGE STATE ---
  const [generalFilters, setGeneralFilters] = useState<GeneralFilterState>({
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    bolge: [],
    kuyrukNumarasi: [],
    ucusSahasi: [],
    ucusTipi: null,
    kabinTipi: [],
    uyelikTipi: [],
    loginTipi: [],
    satinAlinanPaketTuru: []
  });

  // --- DETAILED PAGE STATE ---
  const [detailedFilters, setDetailedFilters] = useState<DetailedFilterState>({
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    timeHour: null,
    flightId: '',
    kuyrukNumarasi: [],
    ucusNumarasi: '',
    origin: [],
    destination: [],
    bolge: [],
    routeType: [],
    flightType: null,
    loginType: [],
    membershipType: [],
    appType: [],
    paymentMethod: [],
    purchasedPackage: [],
    packageAssignmentStatus: [],
    failureReason: []
  });

  // --- APP USAGE PAGE STATE ---
  const [appUsageFilters, setAppUsageFilters] = useState<AppUsageFilterState>({
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    timeHour: null,
    flightId: '',
    kuyrukNumarasi: [],
    ucusNumarasi: '',
    origin: [],
    destination: [],
    bolge: [],
    ucusSahasi: [],
    ucusTipi: null,
    uygulamaTuru: []
  });

  // --- PASSENGER ANALYSIS PAGE STATE ---
  const [passengerFilters, setPassengerFilters] = useState<PassengerAnalysisFilterState>({
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    timeHour: null,
    flightId: '',
    kuyrukNumarasi: [],
    ucusNumarasi: '',
    origin: [],
    destination: [],
    kabinTipi: [],
    userSegment: [],
    ucusSahasi: [],
    ucusTipi: null,
    connectionStatus: [],
    purchaseStatus: [],
    paymentMethod: [],
    usedPackageName: [],
    usedAppName: [],
    userName: []
  });

  // --- GENERAL FILTER LOGIC ---
  const generalData = useMemo(() => {
    return MOCK_DATA.filter(row => {
      if (row.tarih < generalFilters.startDate || row.tarih > generalFilters.endDate) return false;
      if (generalFilters.bolge.length > 0 && !generalFilters.bolge.includes(row.bolge)) return false;
      if (generalFilters.ucusSahasi.length > 0 && !generalFilters.ucusSahasi.includes(row.ucusSahasi)) return false;
      if (generalFilters.ucusTipi && row.ucusTipi !== generalFilters.ucusTipi) return false;
      if (generalFilters.kabinTipi.length > 0 && !generalFilters.kabinTipi.includes(row.kabinTipi)) return false;
      if (generalFilters.kuyrukNumarasi.length > 0 && !generalFilters.kuyrukNumarasi.includes(row.kuyrukNumarasi)) return false;
      if (generalFilters.uyelikTipi.length > 0 && !generalFilters.uyelikTipi.includes(row.uyelikTipi)) return false;
      if (generalFilters.loginTipi.length > 0 && !generalFilters.loginTipi.includes(row.loginTipi)) return false;
      if (generalFilters.satinAlinanPaketTuru.length > 0 && !generalFilters.satinAlinanPaketTuru.includes(row.satinAlinanPaketTuru)) return false;
      return true;
    });
  }, [generalFilters]);

  // --- DETAILED FILTER LOGIC ---
  const detailedData = useMemo(() => {
    return MOCK_DETAILED_DATA.filter(row => {
      if (row.tarih < detailedFilters.startDate || row.tarih > detailedFilters.endDate) return false;
      if (detailedFilters.timeHour && row.timeHour !== detailedFilters.timeHour) return false;
      if (detailedFilters.flightId && !row.flightId.toLowerCase().includes(detailedFilters.flightId.toLowerCase())) return false;
      if (detailedFilters.kuyrukNumarasi.length > 0 && !detailedFilters.kuyrukNumarasi.includes(row.kuyrukNumarasi)) return false;
      if (detailedFilters.bolge.length > 0 && !detailedFilters.bolge.includes(row.bolge)) return false;
      if (detailedFilters.origin.length > 0 && !detailedFilters.origin.includes(row.origin)) return false;
      if (detailedFilters.destination.length > 0 && !detailedFilters.destination.includes(row.destination)) return false;
      if (detailedFilters.routeType.length > 0 && !detailedFilters.routeType.includes(row.routeType)) return false;
      if (detailedFilters.flightType && row.flightType !== detailedFilters.flightType) return false;
      if (detailedFilters.loginType.length > 0 && !detailedFilters.loginType.includes(row.loginType)) return false;
      if (detailedFilters.membershipType.length > 0 && !detailedFilters.membershipType.includes(row.membershipType)) return false;
      if (detailedFilters.paymentMethod.length > 0 && !detailedFilters.paymentMethod.includes(row.paymentMethod)) return false;
      if (detailedFilters.purchasedPackage.length > 0 && !detailedFilters.purchasedPackage.includes(row.purchasedPackage)) return false;
      if (detailedFilters.packageAssignmentStatus.length > 0 && !detailedFilters.packageAssignmentStatus.includes(row.packageAssignmentStatus)) return false;
      if (detailedFilters.failureReason.length > 0 && !detailedFilters.failureReason.includes(row.failureReason)) return false;
      
      if (detailedFilters.appType.length > 0) {
          const hasSelectedApp = detailedFilters.appType.some(app => row.appUsage[app] !== undefined && (row.appUsage[app] || 0) > 0);
          if (!hasSelectedApp) return false;
      }

      return true;
    });
  }, [detailedFilters]);

  // --- APP USAGE FILTER LOGIC ---
  const appUsageData = useMemo(() => {
    return MOCK_APP_USAGE_DATA.filter(row => {
      if (row.tarih < appUsageFilters.startDate || row.tarih > appUsageFilters.endDate) return false;
      if (appUsageFilters.timeHour && row.timeHour !== appUsageFilters.timeHour) return false;
      if (appUsageFilters.flightId && !row.flightId.toLowerCase().includes(appUsageFilters.flightId.toLowerCase())) return false;
      if (appUsageFilters.ucusNumarasi && !row.ucusNumarasi.toLowerCase().includes(appUsageFilters.ucusNumarasi.toLowerCase())) return false;
      if (appUsageFilters.kuyrukNumarasi.length > 0 && !appUsageFilters.kuyrukNumarasi.includes(row.kuyrukNumarasi)) return false;
      if (appUsageFilters.bolge.length > 0 && !appUsageFilters.bolge.includes(row.bolge)) return false;
      if (appUsageFilters.origin.length > 0 && !appUsageFilters.origin.includes(row.origin)) return false;
      if (appUsageFilters.destination.length > 0 && !appUsageFilters.destination.includes(row.destination)) return false;
      if (appUsageFilters.ucusSahasi.length > 0 && !appUsageFilters.ucusSahasi.includes(row.ucusSahasi)) return false;
      if (appUsageFilters.ucusTipi && row.ucusTipi !== appUsageFilters.ucusTipi) return false;
      if (appUsageFilters.uygulamaTuru.length > 0 && !appUsageFilters.uygulamaTuru.includes(row.uygulamaTuru)) return false;
      return true;
    });
  }, [appUsageFilters]);

  // --- PASSENGER ANALYSIS FILTER LOGIC ---
  const passengerData = useMemo(() => {
    return MOCK_PASSENGER_DATA.filter(row => {
      if (row.ucusTarihi < passengerFilters.startDate || row.ucusTarihi > passengerFilters.endDate) return false;
      if (passengerFilters.timeHour && row.timeHour !== passengerFilters.timeHour) return false;
      if (passengerFilters.flightId && !row.flightId.toLowerCase().includes(passengerFilters.flightId.toLowerCase())) return false;
      if (passengerFilters.kuyrukNumarasi.length > 0 && !passengerFilters.kuyrukNumarasi.includes(row.kuyrukNumarasi)) return false;
      if (passengerFilters.origin.length > 0 && !passengerFilters.origin.includes(row.origin)) return false;
      if (passengerFilters.destination.length > 0 && !passengerFilters.destination.includes(row.destination)) return false;
      if (passengerFilters.kabinTipi.length > 0 && !passengerFilters.kabinTipi.includes(row.kabinTipi)) return false;
      if (passengerFilters.userSegment.length > 0 && !passengerFilters.userSegment.includes(row.userSegment)) return false;
      if (passengerFilters.ucusSahasi.length > 0 && !passengerFilters.ucusSahasi.includes(row.ucusSahasi)) return false;
      if (passengerFilters.ucusTipi && row.ucusTipi !== passengerFilters.ucusTipi) return false;
      if (passengerFilters.connectionStatus.length > 0 && !passengerFilters.connectionStatus.includes(row.connectionStatus)) return false;
      if (passengerFilters.purchaseStatus.length > 0 && !passengerFilters.purchaseStatus.includes(row.purchaseStatus)) return false;
      if (passengerFilters.paymentMethod.length > 0 && !passengerFilters.paymentMethod.includes(row.paymentMethod)) return false;
      if (passengerFilters.usedAppName.length > 0 && row.usedAppName !== 'N/A' && !passengerFilters.usedAppName.includes(row.usedAppName as any)) return false;
      if (passengerFilters.userName.length > 0 && !passengerFilters.userName.includes(row.userName)) return false;
      return true;
    });
  }, [passengerFilters]);

  const handleExportExcel = () => {
    let data: any[] = [];
    let currentFilters: any = {};

    if (activePage === 'general') {
        data = generalData;
        currentFilters = generalFilters;
    } else if (activePage === 'detailed') {
        data = detailedData;
        currentFilters = detailedFilters;
    } else if (activePage === 'appUsage') {
        data = appUsageData;
        currentFilters = appUsageFilters;
    } else if (activePage === 'passengerAnalysis') {
        data = passengerData;
        currentFilters = passengerFilters;
    }

    if (data.length === 0) {
        alert("Dışa aktarılacak veri bulunamadı.");
        return;
    }

    // Format filters for header
    const filterStrings = Object.entries(currentFilters)
        .filter(([_, value]) => {
            if (Array.isArray(value)) return value.length > 0;
            return value !== null && value !== '';
        })
        .map(([key, value]) => {
             const valStr = Array.isArray(value) ? value.join(', ') : String(value);
             return `${key}: [${valStr}]`;
        });
    
    const filterHeader = "RAPOR TARIHI: " + new Date().toLocaleString('tr-TR') + "\n" +
                         "UYGULANAN FILTRELER: \n" + filterStrings.join('\n') + "\n\n";

    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(row => Object.values(row).map(val => {
        if (val === null || val === undefined) return '';
        // Handle object/array in cells if any
        let str = val;
        if (typeof val === 'object') str = JSON.stringify(val);
        // Escape quotes
        str = String(str).replace(/"/g, '""');
        return `"${str}"`;
    }).join(','));
    
    // Add BOM for Excel UTF-8 compatibility
    const BOM = "\uFEFF"; 
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(BOM + filterHeader + headers + '\n' + rows.join('\n'));
    
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `${activePage}_report_2025_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = async () => {
    const input = document.getElementById('dashboard-content');
    if (!input) return;

    try {
        // Use html2canvas to capture the visual content
        const canvas = await html2canvas(input, {
            scale: 2, // Improve quality
            useCORS: true,
            logging: false,
            ignoreElements: (element) => element.classList.contains('print:hidden') // Avoid capturing elements hidden for print/export if tagged
        });

        const imgData = canvas.toDataURL('image/png');
        
        // Use a custom page size matching the content to ensure it fits perfectly as a dashboard snapshot
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        const pdf = new jsPDF({
            orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
            unit: 'px',
            format: [imgWidth, imgHeight]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${activePage}_dashboard_2025.pdf`);

    } catch (err) {
        console.error("PDF Export Error:", err);
        alert("PDF oluşturulurken bir sorun oluştu.");
    }
  };

  const renderContent = () => {
      switch(activePage) {
          case 'general':
              return (
                <div className="animate-fade-in space-y-6">
                    <GeneralFilterBar filters={generalFilters} setFilters={setGeneralFilters} />
                    <GeneralDashboardCharts data={generalData} />
                    <GeneralDataTable data={generalData} onExport={handleExportExcel} />
                </div>
              );
          case 'detailed':
              return (
                <div className="animate-fade-in space-y-6">
                    <DetailedFilterBar filters={detailedFilters} setFilters={setDetailedFilters} />
                    <DetailedDashboardCharts data={detailedData} selectedTails={detailedFilters.kuyrukNumarasi} />
                    <DetailedDataTable data={detailedData} onExport={handleExportExcel} />
                </div>
              );
          case 'appUsage':
              return (
                  <div className="animate-fade-in space-y-6">
                      <AppUsageFilterBar filters={appUsageFilters} setFilters={setAppUsageFilters} />
                      <AppUsageDashboardCharts data={appUsageData} />
                      <AppUsageDataTable data={appUsageData} onExport={handleExportExcel} />
                  </div>
              );
          case 'passengerAnalysis':
              return (
                  <div className="animate-fade-in space-y-6">
                      <PassengerFilterBar filters={passengerFilters} setFilters={setPassengerFilters} />
                      <PassengerDashboardCharts data={passengerData} />
                      <PassengerDataTable data={passengerData} onExport={handleExportExcel} />
                  </div>
              );
          default: return null;
      }
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-100">
      <Header 
        activePage={activePage} 
        setActivePage={setActivePage}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />
      
      <main id="dashboard-content" className="container mx-auto px-4 py-6 bg-slate-100">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
