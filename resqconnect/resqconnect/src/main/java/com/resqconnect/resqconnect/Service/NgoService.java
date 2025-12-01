package com.resqconnect.resqconnect.Service;

import com.resqconnect.resqconnect.Modal.NgoModal;
import com.resqconnect.resqconnect.Modal.RequestModal;
import com.resqconnect.resqconnect.Modal.RescueTeamModal;
import com.resqconnect.resqconnect.Modal.UserModal;
import com.resqconnect.resqconnect.Repository.NgoRepository;
import com.resqconnect.resqconnect.Repository.RequestRepo;
import com.resqconnect.resqconnect.Repository.RescueTeamRepository;
import com.resqconnect.resqconnect.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NgoService {
    @Autowired
    private NgoRepository rep;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RescueTeamRepository rescueTeamRepository;
    @Autowired
    private RequestRepo requestRepo;

    public void createNgo(NgoModal ngoModal){
        rep.save(ngoModal);
    }

    public NgoModal verifyNgo(NgoModal ngoModal) {
        NgoModal existingNgo = rep.findByNgoNameAndContactNo(ngoModal.getNgoName(), ngoModal.getContactNo());
        System.out.println(existingNgo);
        if (existingNgo != null) {
            System.out.println("ngo verified");
            return existingNgo;
        }
        System.out.println("ngo not verified");
        ngoModal.setNgoId(0);
        return ngoModal;
    }

    public UserModal assignRescueTeamToUser(int userId, int teamId) {
        Optional<UserModal> userOpt = userRepository.findById(userId);
        Optional<RescueTeamModal> teamOpt = rescueTeamRepository.findById(teamId);
        if (userOpt.isPresent() && teamOpt.isPresent()) {
            UserModal userModal = userOpt.get();
            userModal.setTeamId(teamId);
            return userRepository.save(userModal);
        } else {
            throw new RuntimeException("User or Team not found");
        }
    }

    public void assignRequest(int requestId, int teamId) {
        RequestModal requestModal = requestRepo.findByRequestId(requestId);
        requestModal.setTeamId(teamId);
        requestRepo.save(requestModal);
    }
}
