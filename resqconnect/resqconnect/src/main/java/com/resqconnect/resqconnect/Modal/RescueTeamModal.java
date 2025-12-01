package com.resqconnect.resqconnect.Modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
    @Entity
    @Table(name = "rescue_teams", schema = "team1_2025")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class RescueTeamModal {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "team_id")
        private int teamId;
        @Column(name = "team_name")
        private String teamName;
        @Column(name = "zone")
        private String zone;
        @Column(name = "team_lead")
        private String teamLead;
        @Column(name = "ngo_id")
        private int ngoId;
        @Column(name = "request_id")
        private Integer requestId;
    }


