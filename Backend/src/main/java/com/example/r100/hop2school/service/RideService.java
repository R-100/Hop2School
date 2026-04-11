package com.example.r100.hop2school.service;


import com.example.r100.hop2school.dto.CreateRide;
import com.example.r100.hop2school.dto.Month;
import com.example.r100.hop2school.dto.Ride;
import com.example.r100.hop2school.entity.RideEntity;
import com.example.r100.hop2school.enums.Status;

import java.util.List;
import java.util.UUID;

public interface RideService {
    Ride getRide(UUID rideId);

    RideEntity findRideById(UUID id);

    List<Ride> getAllPendingRide();

    List<Ride> getAllMyRide();

    void createRide(CreateRide command);

    void updateRide(CreateRide command, UUID rideId);

    void cancelRide(UUID rideId);

    void bookRide(UUID rideId);

    boolean isAuthUserBookRideById(UUID id);

    List<Ride> getMyStatusRidesAndTrips(Status status);

    List<Ride> getMyTrips();

    double getAllProfit();

    int getAllTimeRides();

    int getAllTimeTrips();

    double getAverageRideLoad();

    double getReliabilityAverage();

    List<Month> getMyColumnChartByYear(long year);
}
