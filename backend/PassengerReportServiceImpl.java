
package com.geneldurum.report.service.impl;

import com.geneldurum.report.model.PassengerAnalysisRecord;
import com.geneldurum.report.service.ReportService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PassengerReportServiceImpl implements ReportService {

    @Override
    public List<PassengerAnalysisRecord> filterRecords(List<PassengerAnalysisRecord> rawData, Map<String, Object> filters) {
        return rawData.stream()
            .filter(record -> applyFilters(record, filters))
            .collect(Collectors.toList());
    }

    @Override
    public long countUniqueDevices(List<PassengerAnalysisRecord> data) {
        return data.stream()
            .map(PassengerAnalysisRecord::getMac)
            .distinct()
            .count();
    }

    @Override
    public Map<String, Double> calculateUsageByPackage(List<PassengerAnalysisRecord> data) {
        return data.stream()
            .filter(r -> !"N/A".equals(r.getUsedPackageName()))
            .collect(Collectors.groupingBy(
                PassengerAnalysisRecord::getUsedPackageName,
                Collectors.summingDouble(PassengerAnalysisRecord::getDataUsageMB)
            ));
    }

    @Override
    public Map<String, Double> calculateUsageByApp(List<PassengerAnalysisRecord> data) {
        return data.stream()
            .filter(r -> !"N/A".equals(r.getUsedAppName()))
            .collect(Collectors.groupingBy(
                PassengerAnalysisRecord::getUsedAppName,
                Collectors.summingDouble(PassengerAnalysisRecord::getDataUsageMB)
            ));
    }

    private boolean applyFilters(PassengerAnalysisRecord record, Map<String, Object> filters) {
        // Filtreleme mantığı burada kapsüllenir
        return true; 
    }
}
