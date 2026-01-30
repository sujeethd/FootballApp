package com.shrank.footballapp.repository;

import com.shrank.footballapp.domain.SyncLog;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SyncLogRepository extends JpaRepository<SyncLog, UUID> {
    Optional<SyncLog> findByJob(String job);
}
