package com.resqconnect.resqconnect.Service;

import com.resqconnect.resqconnect.Modal.AdminModal;
import com.resqconnect.resqconnect.Modal.ChannelModal;
import com.resqconnect.resqconnect.Repository.AdminRepository;
import com.resqconnect.resqconnect.Repository.ChannelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService {
    @Autowired
    private AdminRepository rep;
    @Autowired
    private ChannelRepository chlrep;

    public boolean verifyAdmin(AdminModal adminModal){
        Optional<AdminModal> admin = rep.findById(adminModal.getUsername());

        if (admin.isPresent()) {
            AdminModal adminData = admin.get();
            return adminData.getPassword().equals(adminModal.getPassword());
        }
        return false;
    }

    public boolean approveChannel(int channelId) {
        ChannelModal channel = chlrep.findByChannelId(channelId);
        if (channel != null) {
            channel.setStatus("active");
            chlrep.save(channel);
            System.out.println("Changed status");
            return true;
        } else {
            System.out.println("Channel not found");
            return false;
        }
    }
}
