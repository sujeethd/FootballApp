package com.shrank.footballapp.repository;

import com.shrank.footballapp.domain.Player;
import com.shrank.footballapp.domain.Team;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player, UUID> {
    List<Player> findByTeamIdOrderByNameAsc(UUID teamId);
    Optional<Player> findByApiId(Integer apiId);
}
