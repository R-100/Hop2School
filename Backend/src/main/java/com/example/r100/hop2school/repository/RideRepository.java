package com.example.r100.hop2school.repository;


import com.example.r100.hop2school.entity.RideEntity;
import com.example.r100.hop2school.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;


@Repository
public interface RideRepository extends JpaRepository<RideEntity, UUID> {
    List<RideEntity> findByStatus(Status status);
    List<RideEntity> findByDriverId(UUID driverId);
    List<RideEntity> findByPassengersId(UUID userId);
}
