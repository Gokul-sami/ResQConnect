package com.resqconnect.resqconnect.Service;

import com.resqconnect.resqconnect.Modal.RescueTeamModal;
import com.resqconnect.resqconnect.Repository.RescueTeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RescueTeamService {

    @Autowired
    private RescueTeamRepository rescueTeamRepository;

    public RescueTeamModal createTeam(RescueTeamModal team) {
        return rescueTeamRepository.save(team);
    }

    public List<RescueTeamModal> getAllTeams() {
        return rescueTeamRepository.findAll();
    }

    public List<RescueTeamModal> getTeamsByNgoId(int ngoId) { return rescueTeamRepository.findByNgoId(ngoId);}
}
