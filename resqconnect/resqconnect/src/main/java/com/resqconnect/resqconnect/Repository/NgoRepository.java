package com.resqconnect.resqconnect.Repository;

import com.resqconnect.resqconnect.Modal.NgoModal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NgoRepository extends JpaRepository<NgoModal, Integer> {
    public NgoModal findByNgoNameAndContactNo(String ngoName, String contactNo);
}
