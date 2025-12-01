package com.resqconnect.resqconnect.Controller;

import com.resqconnect.resqconnect.Modal.RescueTeamModal;
import com.resqconnect.resqconnect.Modal.RescueTeamModal;
import com.resqconnect.resqconnect.Service.RescueTeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin("*")
@RestController
public class RescueTeamController {

    @Autowired
    private RescueTeamService rescueTeamService;

    @PostMapping("/rescue_team/create")
    public RescueTeamModal createTeam(@RequestBody RescueTeamModal team) {
        return rescueTeamService.createTeam(team);
    }

    @GetMapping("/rescue_team/all")
    public List<RescueTeamModal> getAllTeams() {
        return rescueTeamService.getAllTeams();
    }

    @GetMapping("/rescue_team/by_ngo/{ngoId}")
    public List<RescueTeamModal> getTeamsByNgoId(@PathVariable int ngoId) {
        return rescueTeamService.getTeamsByNgoId(ngoId);
    }
}
