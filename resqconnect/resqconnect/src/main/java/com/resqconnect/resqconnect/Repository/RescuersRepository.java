package com.resqconnect.resqconnect.Repository;

import com.resqconnect.resqconnect.Modal.RescuersModal;
import com.resqconnect.resqconnect.Modal.UserModal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RescuersRepository extends JpaRepository<RescuersModal, Integer> {
    List<RescuersModal> findByRoleInAndAddedIsNull(List<String> list);
}
