package com.resqconnect.resqconnect.Controller;

import com.resqconnect.resqconnect.Modal.RescuersModal;
import com.resqconnect.resqconnect.Service.RescuersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin("*")
@RestController
public class RescuersController {

    @Autowired
    private RescuersService rescuersService;

    @GetMapping("/rescuers/get_unadded")
    public List<RescuersModal> getUnaddedRescuers() {
        return rescuersService.getUnaddedVolunteersAndRescueMembers();
    }
}
