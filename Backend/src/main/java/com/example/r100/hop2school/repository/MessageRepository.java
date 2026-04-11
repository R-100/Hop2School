package com.example.r100.hop2school.repository;


import com.example.r100.hop2school.entity.MessageEntity;
import com.example.r100.hop2school.entity.RideEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;


@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, UUID> {
    List<MessageEntity> findByRide(RideEntity ride);
}
