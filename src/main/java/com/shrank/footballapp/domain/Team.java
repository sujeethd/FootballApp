package com.shrank.footballapp.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "teams")
public class Team {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(name = "api_id", nullable = false, unique = true)
    private Integer apiId;

    @Column(nullable = false)
    private String name;

    @Column(name = "fifa_code")
    private String fifaCode;

    private String country;

    @Column(name = "flag_url")
    private String flagUrl;

    @Column(name = "world_ranking")
    private Integer worldRanking;

    @Column(name = "world_ranking_updated_at")
    private Instant worldRankingUpdatedAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Integer getApiId() {
        return apiId;
    }

    public void setApiId(Integer apiId) {
        this.apiId = apiId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFifaCode() {
        return fifaCode;
    }

    public void setFifaCode(String fifaCode) {
        this.fifaCode = fifaCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getFlagUrl() {
        return flagUrl;
    }

    public void setFlagUrl(String flagUrl) {
        this.flagUrl = flagUrl;
    }

    public Integer getWorldRanking() {
        return worldRanking;
    }

    public void setWorldRanking(Integer worldRanking) {
        this.worldRanking = worldRanking;
    }

    public Instant getWorldRankingUpdatedAt() {
        return worldRankingUpdatedAt;
    }

    public void setWorldRankingUpdatedAt(Instant worldRankingUpdatedAt) {
        this.worldRankingUpdatedAt = worldRankingUpdatedAt;
    }
}
