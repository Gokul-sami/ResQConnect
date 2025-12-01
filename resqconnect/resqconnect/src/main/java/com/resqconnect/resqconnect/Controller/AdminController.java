package com.resqconnect.resqconnect.Controller;

import com.resqconnect.resqconnect.Modal.AdminModal;
import com.resqconnect.resqconnect.Modal.ChannelModal;
import com.resqconnect.resqconnect.Modal.NgoModal;
import com.resqconnect.resqconnect.Repository.AdminRepository;
import com.resqconnect.resqconnect.Repository.ChannelRepository;
import com.resqconnect.resqconnect.Service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin("*")
@RestController
public class AdminController {
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private AdminService adminService;
    @Autowired
    private ChannelRepository channelRepository;

    @PostMapping("/admin_verify")
    public boolean createUser(@RequestBody AdminModal adminModal) {
        boolean res;
        return res = adminService.verifyAdmin(adminModal);
    }

    @GetMapping("/getAllChannels")
    public List<ChannelModal> getAllNgos() {
        return channelRepository.findAll();
    }

    @PostMapping("/approve_channel/{channelId}")
    public boolean approveChannel(@PathVariable int channelId) {
        boolean res;
        return res = adminService.approveChannel(channelId);
    }
}
