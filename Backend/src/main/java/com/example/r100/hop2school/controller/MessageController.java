package com.example.r100.hop2school.controller;

import com.example.r100.hop2school.dto.CreateMessage;
import com.example.r100.hop2school.dto.Message;
import com.example.r100.hop2school.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/message")
public class MessageController {
    private final MessageService service;

    public MessageController(MessageService messageService) {
        this.service = messageService;
    }

    @GetMapping("{id}")
    public List<Message> getMessageByRide(@PathVariable UUID id){
        return service.getMessagesForRide(id);
    }

    @PostMapping
    public void sendMessage(@RequestBody CreateMessage command) {
        service.sendMessage(command);
    }
}
