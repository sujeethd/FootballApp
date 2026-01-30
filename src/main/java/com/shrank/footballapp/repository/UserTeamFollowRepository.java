package com.shrank.footballapp.repository;

import com.shrank.footballapp.domain.UserTeamFollow;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserTeamFollowRepository extends JpaRepository<UserTeamFollow, UUID> {
}
