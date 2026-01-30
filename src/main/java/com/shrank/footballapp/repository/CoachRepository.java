package com.shrank.footballapp.repository;

import com.shrank.footballapp.domain.Coach;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoachRepository extends JpaRepository<Coach, UUID> {
    List<Coach> findByTeamId(UUID teamId);
}
