package com.example.r100.hop2school.serviceImpl;

import com.example.r100.hop2school.dto.CreateRide;
import com.example.r100.hop2school.dto.Month;
import com.example.r100.hop2school.dto.Ride;
import com.example.r100.hop2school.entity.RideEntity;
import com.example.r100.hop2school.entity.UserEntity;
import com.example.r100.hop2school.enums.Status;
import com.example.r100.hop2school.repository.RideRepository;
import com.example.r100.hop2school.repository.UserRepository;
import com.example.r100.hop2school.service.EmailSenderService;
import com.example.r100.hop2school.service.RideService;
import com.example.r100.hop2school.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RideServiceImpl implements RideService {

    private final RideRepository repository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final EmailSenderService senderService;

    public RideServiceImpl(RideRepository repository, UserService userService, UserRepository userRepository, EmailSenderService senderService) {
        this.repository = repository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.senderService = senderService;
    }

    @Override
    public Ride getRide(UUID rideId) {
        return map(findRideById(rideId));
    }

    @Override
    public RideEntity findRideById(UUID id) {
        return repository.findById(id).get();
    }

    @Override
    public List<Ride> getAllPendingRide() {
        return repository.findByStatus(Status.PENDING).stream()
                .filter(item -> !item.getDriver().equals(userService.getAuthenticationUserEntity()))
                .map(this::map)
                .collect(Collectors.toList());
    }

    @Override
    public List<Ride> getAllMyRide() {
        return repository.findByDriverId(userService.getAuthenticationUserEntity().getId()).stream().map(this::map)
                .collect(Collectors.toList());
    }

    private Ride map(RideEntity entity) {
        Ride ride = new Ride();
        ride.setId(entity.getId());
        ride.setDriverName(entity.getDriver().getUsername());
        ride.setDriverId(entity.getDriver().getId());
        ride.setPostalCode(entity.getPostalCode());
        ride.setStreet(entity.getStreet());
        ride.setHouseNumber(entity.getHouseNumber());
        ride.setCity(entity.getCity());
        ride.setStartDate(entity.getStartDate());
        ride.setCreateDate(entity.getCreateDate());
        ride.setStartTime(entity.getStartTime());
        ride.setEndTime(entity.getEndTime());
        ride.setPrice(entity.getPrice());
        ride.setStatus(entity.getStatus());
        ride.setSeats(entity.getSeats());
        ride.setBelgeSeats(entity.getPassengers().size());
        return ride;
    }

    @Override
    public void createRide(CreateRide command) {
        RideEntity entity = new RideEntity();
        entity.setDriver(userService.getAuthenticationUserEntity());
        entity.setPostalCode(command.getPostalCode());
        entity.setStreet(command.getStreet());
        entity.setHouseNumber(command.getHouseNumber());
        entity.setCity(command.getCity());
        entity.setStartDate(command.getStartDate());
        entity.setCreateDate(LocalDate.now());
        entity.setStartTime(command.getStartTime());
        entity.setEndTime(command.getEndTime());
        entity.setPrice(command.getPrice());
        entity.setSeats(command.getSeats());
        entity.setStatus(Status.PENDING);
        repository.save(entity);
    }

    @Override
    public void updateRide(CreateRide command, UUID rideId) {
        RideEntity entity = repository.findById(rideId).get();
        entity.setPostalCode(command.getPostalCode());
        entity.setStreet(command.getStreet());
        entity.setHouseNumber(command.getHouseNumber());
        entity.setCity(command.getCity());
        entity.setStartDate(command.getStartDate());
        entity.setStartTime(command.getStartTime());
        entity.setEndTime(command.getEndTime());
        entity.setPrice(command.getPrice());
        entity.setSeats(command.getSeats());
        repository.save(entity);
        String rideInfo = "<strong>Details zur Fahrt:</strong><br>" +
                "Fahrt-ID: " + entity.getId() + "<br>" +
                "Datum: " + entity.getStartDate() + "<br>" +
                "Abfahrt: " + entity.getStartTime() + " Uhr<br>" +
                "Ankunft: " + entity.getEndTime() + " Uhr<br>" +
                "Abholadresse: " + entity.getStreet() + " " + entity.getHouseNumber() + ", " + entity.getPostalCode() + " " + entity.getCity() + "<br>" +
                "Fahrer: " + entity.getDriver().getUsername() + "<br>" +
                "Preis pro Mitfaherer: " + entity.getPrice() + "€";
        String subjectDriver = "Deine Fahrt wurde erfolgreich bearbeitet";
        String bodyDriver = "du hast deine geplante Fahrt erfolgreich bearbeitet.<br>" +
                "Alle betroffenen Mitfahrer wurden automatisch über die Enterungen informiert.<br><br>" + rideInfo;
        senderService.sendEmail(userService.getAuthenticationUserEntity().getEmail(), userService.getAuthenticationUserEntity().getUsername(), subjectDriver, bodyDriver);
        for (UserEntity passenger : entity.getPassengers()) {
            String subjectPassenger = "Deine gebuchte Fahrt gab es Enterungen";
            String bodyPassenger = "Ihre gebuchte Fahrt wurde vom Fahrer bearbeitet. Bitte prüfen Sie, ob sich die Entfernung für Sie dadurch verändert hat und stornieren Sie die Fahrt gegebenenfalls." + rideInfo;
            senderService.sendEmail(passenger.getEmail(), passenger.getUsername(), subjectPassenger, bodyPassenger);
        }
    }

    @Override
    public void cancelRide(UUID rideId) {
        Optional<RideEntity> optionalRide = repository.findById(rideId);
        if (optionalRide.isEmpty()) {
            throw new EntityNotFoundException("Fahrt mit ID " + rideId + " nicht gefunden");
        }
        RideEntity rideEntity = optionalRide.get();
        UserEntity user = userService.getAuthenticationUserEntity();
        String rideInfo = "<strong>Details zur Fahrt:</strong><br>" +
                "Fahrt-ID: " + rideEntity.getId() + "<br>" +
                "Datum: " + rideEntity.getStartDate() + "<br>" +
                "Abfahrt: " + rideEntity.getStartTime() + " Uhr<br>" +
                "Ankunft: " + rideEntity.getEndTime() + " Uhr<br>" +
                "Abholadresse: " + rideEntity.getStreet() + " " + rideEntity.getHouseNumber() + ", " + rideEntity.getPostalCode() + " " + rideEntity.getCity() + "<br>" +
                "Fahrer: " + rideEntity.getDriver().getUsername() + "<br>" +
                "Preis pro Mitfahrer: " + rideEntity.getPrice() + "€";
        if (rideEntity.getDriver().equals(user)) {
            rideEntity.setStatus(Status.CANCEL);
            repository.save(rideEntity);
            String subjectDriver = "Deine Fahrt wurde erfolgreich storniert";
            String bodyDriver = "Du hast deine geplante Fahrt erfolgreich storniert.<br>" +
                    "Alle betroffenen Mitfahrer wurden automatisch über die Stornierung informiert.<br><br>" + rideInfo;
            senderService.sendEmail(user.getEmail(), user.getUsername(), subjectDriver, bodyDriver);
            for (UserEntity passenger : rideEntity.getPassengers()) {
                String subjectPassenger = "Deine gebuchte Fahrt wurde storniert";
                String bodyPassenger = "Leider wurde deine gebuchte Fahrt vom Fahrer storniert.<br>" +
                        "Du kannst dich gerne nach einer alternativen Fahrt umsehen oder eine neue Buchung vornehmen.<br><br>" + rideInfo;
                senderService.sendEmail(passenger.getEmail(), passenger.getUsername(), subjectPassenger, bodyPassenger);
            }
        } else {
            Set<UserEntity> passengers = new HashSet<>(rideEntity.getPassengers());
            for (UserEntity passenger : passengers) {
                if (passenger.equals(user)) {
                    rideEntity.getPassengers().remove(passenger);
                    repository.save(rideEntity);
                    String subject = "Deine Mitfahrt wurde erfolgreich storniert";
                    String body = "Du hast deine gebuchte Mitfahrt erfolgreich storniert.<br>" +
                            "Wir hoffen, dich bald wieder bei einer Fahrt begrüßen zu dürfen!<br><br>" + rideInfo;
                    senderService.sendEmail(passenger.getEmail(), passenger.getUsername(), subject, body);
                    break;
                }
            }
        }
    }


    @Override
    public void bookRide(UUID rideId) {
        RideEntity rideEntity = repository.findById(rideId).get();
        UserEntity currentUser = userService.getAuthenticationUserEntity();
        if (!rideEntity.getDriver().equals(currentUser) && !isAuthUserBookRideById(rideId)) {
            if (rideEntity.getSeats() > rideEntity.getPassengers().size()) {
                rideEntity.getPassengers().add(currentUser);
                repository.save(rideEntity);
                String subject = "Deine Fahrt wurde erfolgreich gebucht";
                String rideInfo = "<strong>Details zur Fahrt:</strong><br>" +
                        "Fahrt-ID: " + rideEntity.getId() + "<br>" +
                        "Datum: " + rideEntity.getStartDate() + "<br>" +
                        "Abfahrt: " + rideEntity.getStartTime() + " Uhr<br>" +
                        "Ankunft: " + rideEntity.getEndTime() + " Uhr<br>" +
                        "Abholadresse: " + rideEntity.getStreet() + " " + rideEntity.getHouseNumber() + ", " + rideEntity.getPostalCode() + " " + rideEntity.getCity() + "<br>" +
                        "Fahrer: " + rideEntity.getDriver().getUsername() + "<br>" +
                        "Preis pro Mitfaherer: " + rideEntity.getPrice() + "€";
                String body = "deine Buchung war erfolgreich!<br><br>" + rideInfo;
                senderService.sendEmail(currentUser.getEmail(), currentUser.getUsername(), subject, body);
            }
        }
    }

    @Override
    public boolean isAuthUserBookRideById(UUID id) {
        return repository.findById(id)
                .map(RideEntity::getPassengers)
                .map(passengers -> passengers.contains(userService.getAuthenticationUserEntity()))
                .orElse(false);
    }


    @Override
    public List<Ride> getMyStatusRidesAndTrips(Status status) {
        List<Ride> rides = new ArrayList<>();
        rides.addAll(repository.findByStatus(status).stream()
                .filter(item -> item.getDriver().equals(userService.getAuthenticationUserEntity()))
                .map(this::map)
                .toList());
        rides.addAll(repository.findByStatus(status).stream()
                .filter(item -> item.getPassengers().contains(userService.getAuthenticationUserEntity()))
                .map(this::map)
                .toList());
        return rides;
    }

    @Override
    public List<Ride> getMyTrips() {
        return repository.findByStatus(Status.CLOSED).stream()
                .filter(item -> item.getPassengers().contains(userService.getAuthenticationUserEntity()))
                .map(this::map)
                .collect(Collectors.toList());
    }

    @Override
    public double getAllProfit() {
        List<RideEntity> entities = repository.findByDriverId(userService.getAuthenticationUserEntity().getId()).stream().filter(item -> item.getStatus().equals(Status.CLOSED)).toList();
        double profit = 0;
        for (RideEntity entity : entities) {
            profit += entity.getPrice() * entity.getPassengers().size();
        }
        return Math.round(profit * 100.0) / 100.0;
    }

    @Override
    public int getAllTimeRides() {
        return repository.findByDriverId(userService.getAuthenticationUserEntity().getId()).size();
    }

    @Override
    public int getAllTimeTrips() {
        return repository.findByPassengersId(userService.getAuthenticationUserEntity().getId()).size();
    }

    @Override
    public double getAverageRideLoad() {
        List<RideEntity> entities = repository.findByDriverId(userService.getAuthenticationUserEntity().getId()).stream().filter(item -> item.getStatus().equals(Status.CLOSED)).toList();
        double summeSeats = 0;
        double summePassangers = 0;
        int counter = 0;
        for (RideEntity entity : entities) {
            summeSeats += entity.getSeats();
            summePassangers += entity.getPassengers().size();
            counter++;
        }
        return Math.round((((summePassangers / counter) / (summeSeats / counter)) * 100) * 100.0) / 100.0;
    }

    @Override
    public double getReliabilityAverage() {
        List<RideEntity> rides = repository.findByDriverId(userService.getAuthenticationUserEntity().getId());
        double closed = rides.stream().filter(r -> r.getStatus().equals(Status.CLOSED)).count();
        double cancelled = rides.stream().filter(r -> r.getStatus().equals(Status.CANCEL)).count();
        double allRides = closed + cancelled;
        if (allRides == 0) return 0.0;
        return Math.round(((closed / allRides) * 100) * 100.0) / 100.0;
    }

    @Override
    public List<Month> getMyColumnChartByYear(long year) {
        if (String.valueOf(year).length() > 4) {
            throw new IllegalArgumentException("Ein jahr besteht nur aus 4 Zeichen");
        }
        UserEntity authUser = userService.getAuthenticationUserEntity();
        List<RideEntity> driverRides = repository.findByDriverId(authUser.getId()).stream().filter(r -> r.getStartDate().getYear() == year).toList();
        List<RideEntity> passengerRides = repository.findByPassengersId(authUser.getId()).stream().filter(r -> r.getStartDate().getYear() == year).toList();
        List<Month> months = new ArrayList<>(Collections.nCopies(12, new Month()));
        for (int monthIndex = 0; monthIndex < 12; monthIndex++) {
            final int currentMonth = monthIndex + 1;
            Month month = new Month();
            month.setMainColumn(driverRides.stream().filter(r -> r.getStartDate().getMonthValue() == currentMonth).count());
            month.setSecondaryColumn(passengerRides.stream().filter(r -> r.getStartDate().getMonthValue() == currentMonth).count());
            months.set(monthIndex, month);
        }
        return months;
    }

}
