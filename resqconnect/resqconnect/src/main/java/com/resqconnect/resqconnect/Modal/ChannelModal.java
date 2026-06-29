package com.resqconnect.resqconnect.Modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "channel", schema="resqconnect")
public class ChannelModal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="channel_id")
    private int channelId;
    @Column(name="user_id")
    private int userId;
    @Column(name="channel_name")
    private String channelName;
    @Column
    private String zone;
    @Column(name="disaster_type")
    private String disasterType;
    @Column(name="image_url")
    private String imageUrl;
    @Column
    private String status;
    @Column(name="created_at")
    private LocalDateTime createdAt;

    public void setCreated_at(LocalDateTime now) {
        this.createdAt = now;
    }

    public void setStatus(String created) {
        this.status = created;
    }
}
