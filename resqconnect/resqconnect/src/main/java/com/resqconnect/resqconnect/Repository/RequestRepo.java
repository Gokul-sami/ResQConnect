package com.resqconnect.resqconnect.Repository;


import com.resqconnect.resqconnect.Modal.RequestModal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepo extends JpaRepository<RequestModal, Integer> {
    List<RequestModal> findByChannelId(int channelId);

    RequestModal findByRequestId(int requestId);

    @Modifying
    @Query("UPDATE RequestModal r SET r.status = :status WHERE r.requestId = :requestId")
    void updateRequestStatus(@Param("requestId") int requestId, @Param("status") String status);
    @Query("SELECT r FROM RequestModal r WHERE r.requestId = :requestId")
    RequestModal findRequestById(@Param("requestId") int requestId);

}
