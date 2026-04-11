package com.example.r100.hop2school.controller;
import com.example.r100.hop2school.dto.CreateRide;
import com.example.r100.hop2school.dto.Month;
import com.example.r100.hop2school.dto.Ride;
import com.example.r100.hop2school.enums.Status;
import com.example.r100.hop2school.service.RideService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/ride")
public class RideController {
    private final RideService service;

    public RideController(RideService service) {
        this.service = service;
    }

    @GetMapping()
    public List<Ride> getAllPendingRide() {
        return service.getAllPendingRide();
    }

    @GetMapping("/my")
    public List<Ride> getAllMyRide() {
        return service.getAllMyRide();
    }

    @GetMapping("{id}")
    public Ride getRide(@PathVariable UUID id) {
        return service.getRide(id);
    }

    @PostMapping()
    public void create(@RequestBody CreateRide command) {
        service.createRide(command);
    }

    @PutMapping("{id}")
    public void update(@RequestBody CreateRide command, @PathVariable UUID id) {
        service.updateRide(command, id);
    }

    @PostMapping("/book/{id}")
    public void bookRide(@PathVariable UUID id) {
        service.bookRide(id);
    }

    @PostMapping("/cancel/{id}")
    public void cancelRide(@PathVariable UUID id) {
        service.cancelRide(id);
    }

    @GetMapping("/isAuthUserBookRide/{id}")
    public boolean isAuthUserBookRide(@PathVariable UUID id) {
        return service.isAuthUserBookRideById(id);
    }

    @GetMapping("/getMyStatusRidesAndTrips/{status}")
    public List<Ride> getMyStatusRidesAndTrips(@PathVariable Status status) {
        return service.getMyStatusRidesAndTrips(status);
    }

    @GetMapping("/getMyTrips")
    public List<Ride> getMyTrips() {
        return service.getMyTrips();
    }

    @GetMapping("/getAllProfit")
    public double getAllProfit() {
        return service.getAllProfit();
    }

    @GetMapping("/getAllTimeRides")
    public int getAllTimeRides() {
        return service.getAllTimeRides();
    }

    @GetMapping("/getAllTimeTrips")
    public int getAllTimeTrips() {
        return service.getAllTimeTrips();
    }

    @GetMapping("/getAverageRideLoad")
    public double getAverageRideLoad() {
        return service.getAverageRideLoad();
    }

    @GetMapping("/getReliabilityAverage")
    public double getReliabilityAverage() {
        return service.getReliabilityAverage();
    }

    @GetMapping("/getMyColumnChartByYear/{year}")
    public List<Month> getMyColumnChartByYear(@PathVariable long year) {
        return service.getMyColumnChartByYear(year);
    }
}
