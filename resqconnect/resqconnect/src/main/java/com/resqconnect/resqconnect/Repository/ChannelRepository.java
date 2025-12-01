package com.resqconnect.resqconnect.Repository;

import com.resqconnect.resqconnect.Modal.ChannelModal;
import com.resqconnect.resqconnect.Modal.UserModal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChannelRepository extends JpaRepository<ChannelModal, Integer> {
    ChannelModal findByChannelId(int channelId);
}
