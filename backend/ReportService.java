
package com.geneldurum.report.service;

import com.geneldurum.report.model.PassengerAnalysisRecord;
import java.util.List;
import java.util.Map;

public interface ReportService {
    List<PassengerAnalysisRecord> filterRecords(List<PassengerAnalysisRecord> rawData, Map<String, Object> filters);
    long countUniqueDevices(List<PassengerAnalysisRecord> data);
    Map<String, Double> calculateUsageByPackage(List<PassengerAnalysisRecord> data);
    Map<String, Double> calculateUsageByApp(List<PassengerAnalysisRecord> data);
}
