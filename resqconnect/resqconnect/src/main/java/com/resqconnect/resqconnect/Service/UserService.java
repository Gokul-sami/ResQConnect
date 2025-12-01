package com.resqconnect.resqconnect.Service;

import com.resqconnect.resqconnect.Modal.ChannelModal;
import com.resqconnect.resqconnect.Modal.UserModal;
import com.resqconnect.resqconnect.Repository.ChannelRepository;
import com.resqconnect.resqconnect.Repository.UserRepository;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository rep;
    @Autowired
    private ChannelRepository chl;

    public UserModal loginUser(UserModal userModal){
        UserModal existingUser = rep.findByUserNameAndPhoneNo(userModal.getUserName(), userModal.getPhoneNo());
        if (existingUser == null) {
            userModal.setTeamId(0);
            rep.save(userModal);
            System.out.println("user created");
            return userModal;
        }
        else {
            System.out.println("user logged in");
            return existingUser;
        }
    }

    public void createChannel(ChannelModal channelModal) {
        channelModal.setCreated_at(LocalDateTime.now());
        System.out.println(channelModal);
        chl.save(channelModal);
    }

    public List<UserModal> getUsersInTeam(int teamId) {
        return rep.findAllByTeamId(teamId);
    }
}
