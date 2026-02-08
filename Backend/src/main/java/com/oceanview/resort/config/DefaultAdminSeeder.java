package com.oceanview.resort.config;

import com.oceanview.resort.model.User;
import com.oceanview.resort.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DefaultAdminSeeder implements CommandLineRunner {

    private static final String DEFAULT_SUPER_ADMIN_USERNAME = "superadmin";
    private static final String DEFAULT_SUPER_ADMIN_PASSWORD = "superadmin123";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DefaultAdminSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername(DEFAULT_SUPER_ADMIN_USERNAME).isEmpty()) {
            User superAdmin = new User();
            superAdmin.setUsername(DEFAULT_SUPER_ADMIN_USERNAME);
            superAdmin.setPasswordHash(passwordEncoder.encode(DEFAULT_SUPER_ADMIN_PASSWORD));
            superAdmin.setEmail("superadmin@oceanview.resort");
            superAdmin.setFullName("Super Administrator");
            superAdmin.setPhone("");
            superAdmin.setAddress("");
            superAdmin.setNicNumber("");
            superAdmin.setRole(User.Role.SUPER_ADMIN);
            userRepository.save(superAdmin);
        }
    }
}