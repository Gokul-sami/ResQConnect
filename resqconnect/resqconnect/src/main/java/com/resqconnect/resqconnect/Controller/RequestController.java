package com.resqconnect.resqconnect.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;



import com.resqconnect.resqconnect.Modal.RequestModal;
import com.resqconnect.resqconnect.Repository.RequestRepo;
import com.resqconnect.resqconnect.Service.RequestService;

//@CrossOrigin("*")
@RestController
public class RequestController {

    @Autowired
    private RequestRepo requestRepository;
    @Autowired
    private RequestService requestService;

    @GetMapping("/get_requests/{channelId}")
    public List<RequestModal> getRequestsByChannelId(@PathVariable int channelId) {
        return requestRepository.findByChannelId(channelId);
    }

    @GetMapping("get_all_requests")
    public List<RequestModal> getAllRequests(){
        return requestRepository.findAll();
    }

    @PostMapping("/create_request")
    public void createRequest(@RequestBody RequestModal requestModal) {
        System.out.println(requestModal);
        requestService.saveRequest(requestModal);
        System.out.println("Request created");
    }

    @PostMapping("/update_request_status")
    public ResponseEntity<String> updateRequestStatus(@RequestParam int requestId, @RequestParam String status) {
        try {
            requestService.updateRequestStatus(requestId, status);
            return ResponseEntity.ok("Status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update status");
    }}
}
