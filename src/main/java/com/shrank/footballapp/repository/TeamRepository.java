package com.shrank.footballapp.repository;

import com.shrank.footballapp.domain.Team;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, UUID> {
    List<Team> findAllByOrderByNameAsc();
    Optional<Team> findByApiId(Integer apiId);
}
