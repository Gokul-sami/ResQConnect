package com.resqconnect.resqconnect.Service;

import com.resqconnect.resqconnect.Modal.ChatsModal;
import com.resqconnect.resqconnect.Repository.ChatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ChatsService {
    @Autowired
    private ChatsRepository rep;

    public void createChat(ChatsModal chatModal) {
        chatModal.setCreatedAt(LocalDateTime.now());
        System.out.println(chatModal);
        rep.save(chatModal);
    }
}
