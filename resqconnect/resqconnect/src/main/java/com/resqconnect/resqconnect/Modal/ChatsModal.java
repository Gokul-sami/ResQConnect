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
@Table(name = "chats", schema="resqconnect")
public class ChatsModal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="chat_id")
    private int chatId;
    @Column(name="channel_id")
    private int channelId;
    @Column(name="user_id")
    private int userId;
    @Column(name="name")
    private String name;
    @Column
    private String chatContent;
    @Column
    private LocalDateTime createdAt;
    @Column
    private String image;

    public void setCreatedAt(LocalDateTime now) {
        this.createdAt = now;
    }
}
