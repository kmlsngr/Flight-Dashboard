
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

  // --- FILTER STATES ---
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

  // --- FILTERED DATA MEMOS ---
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
      return true;
    });
  }, [detailedFilters]);

  const appUsageData = useMemo(() => {
    return MOCK_APP_USAGE_DATA.filter(row => {
      if (row.tarih < appUsageFilters.startDate || row.tarih > appUsageFilters.endDate) return false;
      if (appUsageFilters.timeHour && row.timeHour !== appUsageFilters.timeHour) return false;
      if (appUsageFilters.kuyrukNumarasi.length > 0 && !appUsageFilters.kuyrukNumarasi.includes(row.kuyrukNumarasi)) return false;
      if (appUsageFilters.uygulamaTuru.length > 0 && !appUsageFilters.uygulamaTuru.includes(row.uygulamaTuru)) return false;
      return true;
    });
  }, [appUsageFilters]);

  const passengerData = useMemo(() => {
    return MOCK_PASSENGER_DATA.filter(row => {
      if (row.ucusTarihi < passengerFilters.startDate || row.ucusTarihi > passengerFilters.endDate) return false;
      if (passengerFilters.timeHour && row.timeHour !== passengerFilters.timeHour) return false;
      if (passengerFilters.kuyrukNumarasi.length > 0 && !passengerFilters.kuyrukNumarasi.includes(row.kuyrukNumarasi)) return false;
      if (passengerFilters.userSegment.length > 0 && !passengerFilters.userSegment.includes(row.userSegment)) return false;
      if (passengerFilters.connectionStatus.length > 0 && !passengerFilters.connectionStatus.includes(row.connectionStatus)) return false;
      if (passengerFilters.userName.length > 0 && !passengerFilters.userName.includes(row.userName)) return false;
      return true;
    });
  }, [passengerFilters]);

  const handleExportExcel = () => {
    let data: any[] = [];
    if (activePage === 'general') data = generalData;
    else if (activePage === 'detailed') data = detailedData;
    else if (activePage === 'appUsage') data = appUsageData;
    else if (activePage === 'passengerAnalysis') data = passengerData;

    if (data.length === 0) return alert("Veri bulunamadı.");

    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const BOM = "\uFEFF"; 
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(BOM + headers + '\n' + rows.join('\n'));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `${activePage}_report_2025.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = async () => {
    // PDF çıktısında hem filtre barını hem grafikleri kapsayan ana kapsayıcıyı hedefle
    const input = document.getElementById('report-export-container');
    if (!input) {
        alert("Rapor alanı bulunamadı.");
        return;
    }

    try {
        const canvas = await html2canvas(input, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#f3f4f6',
            windowWidth: input.scrollWidth,
            windowHeight: input.scrollHeight
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        const pdf = new jsPDF({
            orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
            unit: 'px',
            format: [imgWidth, imgHeight]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${activePage}_tam_analiz_2025.pdf`);
    } catch (err) {
        console.error("PDF Export Error:", err);
    }
  };

  const renderContent = () => {
      switch(activePage) {
          case 'general':
              return (
                <div className="animate-fade-in space-y-6">
                    <div id="report-export-container" className="space-y-6 p-4 rounded-xl">
                        <GeneralFilterBar filters={generalFilters} setFilters={setGeneralFilters} />
                        <div id="charts-container" className="p-4 bg-slate-100 rounded-xl border border-slate-200 shadow-inner">
                            <GeneralDashboardCharts data={generalData} />
                        </div>
                    </div>
                    <GeneralDataTable data={generalData} onExport={handleExportExcel} />
                </div>
              );
          case 'detailed':
              return (
                <div className="animate-fade-in space-y-6">
                    <div id="report-export-container" className="space-y-6 p-4 rounded-xl">
                        <DetailedFilterBar filters={detailedFilters} setFilters={setDetailedFilters} />
                        <div id="charts-container" className="p-4 bg-slate-100 rounded-xl border border-slate-200 shadow-inner">
                            <DetailedDashboardCharts data={detailedData} selectedTails={detailedFilters.kuyrukNumarasi} />
                        </div>
                    </div>
                    <DetailedDataTable data={detailedData} onExport={handleExportExcel} />
                </div>
              );
          case 'appUsage':
              return (
                  <div className="animate-fade-in space-y-6">
                      <div id="report-export-container" className="space-y-6 p-4 rounded-xl">
                        <AppUsageFilterBar filters={appUsageFilters} setFilters={setAppUsageFilters} />
                        <div id="charts-container" className="p-4 bg-slate-100 rounded-xl border border-slate-200 shadow-inner">
                            <AppUsageDashboardCharts data={appUsageData} />
                        </div>
                      </div>
                      <AppUsageDataTable data={appUsageData} onExport={handleExportExcel} />
                  </div>
              );
          case 'passengerAnalysis':
              return (
                  <div className="animate-fade-in space-y-6">
                      <div id="report-export-container" className="space-y-6 p-4 rounded-xl">
                        <PassengerFilterBar filters={passengerFilters} setFilters={setPassengerFilters} />
                        <div id="charts-container" className="p-4 bg-slate-100 rounded-xl border border-slate-200 shadow-inner">
                            <PassengerDashboardCharts data={passengerData} />
                        </div>
                      </div>
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
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
