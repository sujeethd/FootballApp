package com.shrank.footballapp.repository;

import com.shrank.footballapp.domain.MatchEvent;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchEventRepository extends JpaRepository<MatchEvent, UUID> {
}
