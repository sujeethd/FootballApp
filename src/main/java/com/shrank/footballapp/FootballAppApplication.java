package com.shrank.footballapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class FootballAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(FootballAppApplication.class, args);
    }

}
