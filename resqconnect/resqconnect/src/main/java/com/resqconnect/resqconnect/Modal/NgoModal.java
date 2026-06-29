package com.resqconnect.resqconnect.Modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "ngo", schema="resqconnect")
public class NgoModal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="ngo_id")
    private int ngoId;
    @Column(name="ngo_name")
    private String ngoName;
    @Column(name="ngo_head")
    private String ngoHead;
    @Column(name="govt_verified_url")
    private String govtVerifiedUrl;
    @Column
    private int verified;
    @Column(name="contact_no")
    private String contactNo;

    public String getNgoName() {
        return ngoName;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setNgoId(int i) {
        this.ngoId = i;
    }
}
