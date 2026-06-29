package com.resqconnect.resqconnect.Modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "users", schema="resqconnect")
public class UserModal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_id")
    private int userId;
    @Column(name="user_name")
    private String userName;
    @Column(name = "phone_no")
    private String phoneNo;
    @Column
    private String role;
    @Column(name = "team_id")
    private int teamId;

    public String getUserName() {
        return userName;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setTeamId(int teamId) {
        this.teamId = teamId;
    }
}
