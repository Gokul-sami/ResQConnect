package com.resqconnect.resqconnect.Repository;

import com.resqconnect.resqconnect.Modal.ChatsModal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatsRepository extends JpaRepository<ChatsModal, Integer> {
    List<ChatsModal> findByChannelId(int channelId);
}
