package com.resqconnect.resqconnect.Service;

import org.springframework.transaction.annotation.Transactional;
import com.resqconnect.resqconnect.Modal.RequestModal;
import com.resqconnect.resqconnect.Repository.RequestRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RequestService {

    @Autowired
    private RequestRepo requestRepo;

    public RequestModal saveRequest(RequestModal request) {
        request.setCreatedAt(LocalDateTime.now());
        request.setStatus("open");
        request.setImageUrl("image.png");
        return requestRepo.save(request);
    }

    @Transactional
    public void updateRequestStatus(int requestId, String status) {
        RequestModal request = requestRepo.findRequestById(requestId);
        if (request != null) {
            request.setStatus(status);
            requestRepo.save(request);
        }
    }
}
