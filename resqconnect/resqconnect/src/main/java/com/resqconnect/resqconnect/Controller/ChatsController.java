package com.resqconnect.resqconnect.Controller;

import com.resqconnect.resqconnect.Modal.ChatsModal;
import com.resqconnect.resqconnect.Repository.ChatsRepository;
import com.resqconnect.resqconnect.Service.ChatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin("*")
@RestController
public class ChatsController {
    @Autowired
    private ChatsRepository chatsRepository;
    @Autowired
    private ChatsService chatsService;

    @GetMapping("/get_forum_chats/{channelId}")
    public List<ChatsModal> getChatsByChannelId(@PathVariable int channelId) {
        return chatsRepository.findByChannelId(channelId);
    }

    @PostMapping("/create_chat")
    public void createChat(@RequestBody ChatsModal chatModal) {
        chatsService.createChat(chatModal);
        System.out.println("Chats created");
    }
}
