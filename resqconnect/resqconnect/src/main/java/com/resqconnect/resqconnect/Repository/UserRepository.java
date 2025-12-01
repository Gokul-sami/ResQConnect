package com.resqconnect.resqconnect.Repository;

import java.util.List;
import com.resqconnect.resqconnect.Modal.UserModal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserModal, Integer> {

    UserModal findByPhoneNo(String phoneNo);

    UserModal findByUserNameAndPhoneNo(String userName, String phoneNo);

    List<UserModal> findAllByTeamId(int teamId);
}
