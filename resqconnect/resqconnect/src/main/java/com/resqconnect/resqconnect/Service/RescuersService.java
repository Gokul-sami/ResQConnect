package com.resqconnect.resqconnect.Service;

import com.resqconnect.resqconnect.Modal.RescuersModal;
import com.resqconnect.resqconnect.Repository.RescuersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class RescuersService {

    @Autowired
    private RescuersRepository rescuersRepository;

    public List<RescuersModal> getUnaddedVolunteersAndRescueMembers() {
        return rescuersRepository.findByRoleInAndAddedIsNull(Arrays.asList("Volunteer", "Rescue member"));
    }
}
