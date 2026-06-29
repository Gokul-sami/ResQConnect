package com.resqconnect.resqconnect.Modal;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "help_requests", schema = "resqconnect")
public class RequestModal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="request_id")
    private int requestId;
    @Column(name="created_at")
    private LocalDateTime createdAt;
    @Column(name="channel_id")
    private int channelId;
    @Column(name="requester_id")
    private int requesterId;
    @Column(name="team_id")
    private int teamId;
    @Column
    private String category;
    @Column(name="image_url")
    private String imageUrl;
    @Column
    private String address;
    @Column
    private String status;
    @Column
    private String description;
    @Column(name="requester_name")
    private String requesterName;

    public void setCreatedAt(LocalDateTime now) {
        this.createdAt = now;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setImageUrl(String image) {
        this.imageUrl = image;
    }

    public void setTeamId(int teamId) {
        this.teamId = teamId;
    }
}
