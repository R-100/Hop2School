package com.example.r100.hop2school.serviceImpl;

import com.example.r100.hop2school.dto.CreateMessage;
import com.example.r100.hop2school.dto.Message;
import com.example.r100.hop2school.entity.MessageEntity;
import com.example.r100.hop2school.repository.MessageRepository;
import com.example.r100.hop2school.service.MessageService;
import com.example.r100.hop2school.service.RideService;
import com.example.r100.hop2school.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {
    private final MessageRepository repository;
    private final RideService rideService;
    private final UserService userService;

    public MessageServiceImpl(MessageRepository repository, RideService rideService, UserService userService) {
        this.repository = repository;
        this.rideService = rideService;
        this.userService = userService;
    }

    @Override
    public void sendMessage(CreateMessage command) {
        MessageEntity entity = new MessageEntity();
        entity.setUser(userService.getAuthenticationUserEntity());
        entity.setContent(command.getContent());
        entity.setRide(rideService.findRideById(command.getRideId()));
        entity.setTimestamp(LocalDateTime.now());
        repository.save(entity);
    }

    @Override
    public List<Message> getMessagesForRide(UUID rideId) {
        return repository.findByRide(rideService.findRideById(rideId)).stream().map(this::map)
                .collect(Collectors.toList());
    }

    private Message map(MessageEntity entity) {
        Message message = new Message();
        message.setContent(entity.getContent());
        message.setTimestamp(entity.getTimestamp());
        message.setUsername(entity.getUser().getUsername());
        message.setUserId(entity.getUser().getId());
        message.setAuthUser(entity.getUser() == userService.getAuthenticationUserEntity());
        return message;
    }
}
