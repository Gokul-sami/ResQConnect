package com.resqconnect.resqconnect.Modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "users", schema = "team1_2025")
public class RescuersModal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "phone_no")
    private String phoneNo;

    @Column(name = "role")
    private String role;

    @Column(name = "added")
    private String added;

    @Column(name = "team_id")
    private int teamId;
}
