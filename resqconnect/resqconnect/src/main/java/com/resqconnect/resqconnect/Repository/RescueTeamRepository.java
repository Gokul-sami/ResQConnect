package com.resqconnect.resqconnect.Repository;

import com.resqconnect.resqconnect.Modal.RescueTeamModal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RescueTeamRepository extends JpaRepository<RescueTeamModal, Integer> {
    List<RescueTeamModal> findByNgoId(int ngoId);
}
