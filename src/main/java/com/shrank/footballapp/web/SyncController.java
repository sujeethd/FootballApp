package com.shrank.footballapp.web;

import com.shrank.footballapp.service.SyncService;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.util.StringUtils;

@RestController
@RequestMapping("/api")
public class SyncController {
    private static final Logger log = LoggerFactory.getLogger(SyncController.class);
    private final SyncService syncService;

    public SyncController(SyncService syncService) {
        this.syncService = syncService;
    }

    @PostMapping("/sync")
    public ResponseEntity<List<SyncService.SyncResult>> sync(@RequestParam(defaultValue = "all") String type) {
        SyncType syncType = SyncType.from(type);
        List<SyncService.SyncResult> results = new ArrayList<>();

        log.info("Starting sync of type: {}", syncType);
        switch (syncType) {
            case TEAMS -> results.add(syncService.syncTeams());
            case MATCHES -> results.add(syncService.syncFixtures());
            case ALL -> {
                results.add(syncService.syncTeams());
                results.add(syncService.syncFixtures());
            }
        }

        return ResponseEntity.ok(results);
    }

    enum SyncType {
        ALL,
        TEAMS,
        MATCHES;

        static SyncType from(String value) {
            if (!StringUtils.hasText(value)) {
                return ALL;
            }
            try {
                return SyncType.valueOf(value.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException("type must be teams, matches, or all");
            }
        }
    }
}
