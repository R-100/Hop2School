package com.example.r100.hop2school.service;



import com.example.r100.hop2school.dto.CreateMessage;
import com.example.r100.hop2school.dto.Message;

import java.util.List;
import java.util.UUID;

public interface MessageService {

    void sendMessage(CreateMessage command);

    List<Message> getMessagesForRide(UUID rideId);
}
