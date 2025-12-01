package com.resqconnect.resqconnect.Repository;

import com.resqconnect.resqconnect.Modal.AdminModal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<AdminModal, String> {
//    AdminModal findByUserName(String userName);
}
