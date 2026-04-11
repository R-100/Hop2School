package com.example.r100.hop2school;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Hop2SchoolApplication {

	public static void main(String[] args) {
		SpringApplication.run(Hop2SchoolApplication.class, args);
	}

}
