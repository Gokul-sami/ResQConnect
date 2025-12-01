package com.resqconnect.resqconnect.Controller;

import com.resqconnect.resqconnect.Modal.NgoModal;
import com.resqconnect.resqconnect.Modal.RequestModal;
import com.resqconnect.resqconnect.Modal.UserModal;
import com.resqconnect.resqconnect.Repository.NgoRepository;
import com.resqconnect.resqconnect.Repository.RequestRepo;
import com.resqconnect.resqconnect.Service.NgoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin("*")
@RestController
public class NgoController {
    @Autowired
    private NgoRepository ngoRepository;
    @Autowired
    private NgoService ngoService;

    @PostMapping("/ngoSignup")
    public void NgoUser(@RequestBody NgoModal ngoModal) {
        ngoService.createNgo(ngoModal);
        System.out.println("Ngo created");
    }

    @PostMapping("/ngoLogin")
    public NgoModal ngoLogin(@RequestBody NgoModal ngoModal){
        System.out.println("in");
        ngoModal = ngoService.verifyNgo(ngoModal);
        return ngoModal;
    }

    @GetMapping("/getAllNgos")
    public List<NgoModal> getAllNgos() {
        return ngoRepository.findAll();
    }

    @PostMapping("/rescue_team/assign_member/{userId}/{teamId}")
    public UserModal assignTeam(@PathVariable int userId, @PathVariable int teamId) {
        return ngoService.assignRescueTeamToUser(userId, teamId);
    }

    @PostMapping("/assign_request/{requestId}/{teamId}")
    public void assignRequest(@PathVariable int requestId, @PathVariable int teamId){
        ngoService.assignRequest(requestId, teamId);
    }
}
