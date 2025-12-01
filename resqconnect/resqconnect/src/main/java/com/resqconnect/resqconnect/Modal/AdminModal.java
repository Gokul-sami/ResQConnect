package com.resqconnect.resqconnect.Modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "admins", schema="team1_2025")
public class AdminModal {
    @Id
    @Column(name="username")
    private String username;
    @Column
    private String password;

    public Object getPassword() {
        return password;
    }

    public String getUsername() {
        return username;
    }
}
