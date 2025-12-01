package com.resqconnect.resqconnect.Controller;

import com.resqconnect.resqconnect.Modal.ChannelModal;
import com.resqconnect.resqconnect.Modal.UserModal;
import com.resqconnect.resqconnect.Repository.ChannelRepository;
import com.resqconnect.resqconnect.Repository.UserRepository;
import com.resqconnect.resqconnect.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
//@CrossOrigin("*")
@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ChannelRepository channelRepository;
    @Autowired
    private UserService userService;

    @GetMapping("/get_all_users")
    public List<UserModal> getUsers(){
        return userRepository.findAll();
    }

    @PostMapping("/user_login")
    public UserModal createUser(@RequestBody UserModal userModal) {
        return userService.loginUser(userModal);
    }

    @GetMapping("/get_all_channels")
    public List<ChannelModal> getChannels(){
        return channelRepository.findAll();
    }

    @PostMapping("/create_channel")
    public void createChannels(@RequestBody ChannelModal channelModal){
        userService.createChannel(channelModal);
        System.out.println("Channel created");
    }

    @GetMapping("/users/by_team/{teamId}")
    public List<UserModal> getUsersWithTeamId(@PathVariable int teamId){
        return userService.getUsersInTeam(teamId);
    }
}
