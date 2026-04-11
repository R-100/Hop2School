package com.example.r100.hop2school.serviceImpl;

import com.example.r100.hop2school.entity.RideEntity;
import com.example.r100.hop2school.enums.Status;
import com.example.r100.hop2school.repository.RideRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class SchedulerServiceImpl {

    private static final Logger log = LoggerFactory.getLogger(SchedulerServiceImpl.class);
    private final RideRepository rideRepository;

    public SchedulerServiceImpl(RideRepository rideRepository) {
        this.rideRepository = rideRepository;
    }

    @Scheduled(fixedRate = 60000)
    private void updateRideStatus() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        List<RideEntity> entities = rideRepository.findAll();
        for(RideEntity entity : entities) {
            if(entity.getStartDate().isEqual(today) || entity.getStartDate().isBefore(today) && !entity.getStatus().equals(Status.CANCEL)) {
                if(entity.getStartTime().isAfter(now) && entity.getEndTime().isBefore(now)) {
                    entity.setStatus(Status.ACTIVE);
                } else {
                    entity.setStatus(Status.CLOSED);
                }
                rideRepository.save(entity);
            }
        }
    }
}
