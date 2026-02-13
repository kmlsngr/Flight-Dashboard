
package com.geneldurum.report.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PassengerAnalysisRecord {
    private String id;
    private int timeHour;
    private String userName;
    private String name;
    private String surname;
    private String ip;
    private String mac;
    private String nationality;
    private String flightId;
    private String kuyrukNumarasi;
    private String ucusNumarasi;
    private String ucusTarihi;
    private String kabinTipi;
    private String userSegment;
    private String connectionStatus;
    private int dataUsageMB;
    private String usedPackageName;
    private String usedAppName;
    private int sessionCount;
    private int loginCount;
    private int failedPurchaseCount;
}
