package com.oceanview.resort.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/help")
@CrossOrigin(origins = "*")
public class HelpController {

    @GetMapping("/customer")
    public String customerHelp() {
        return """
                Customer Guide:
                1. Browse available rooms on the Home page.
                2. Register for an account and log in.
                3. Choose your room, enter your details, and submit your reservation.
                4. Review your reservation details and print your confirmation.
                """;
    }

    @GetMapping("/staff")
    public String staffHelp() {
        return """
                Staff Guide:
                1. Log in with your staff account (Front Officer / Manager / Admin).
                2. Use the dashboard to view today's arrivals and departures.
                3. Create new reservations for walk-in guests using the reservation form.
                4. Update room information and statuses as needed.
                """;
    }
}

