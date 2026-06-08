package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret",
                "mySecretKeyForTestingPurposesOnlyMustBeLongEnoughForHS512AlgorithmSecurityAndItShouldBe512BitsAtLeastSoThisIsLongEnoughNowForReal");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 60000);
    }

    private Authentication buildAuth(String username) {
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username(username)
                .firstName("John")
                .lastName("Doe")
                .password("pwd")
                .admin(false)
                .build();
        return new UsernamePasswordAuthenticationToken(userDetails, null);
    }

    @Test
    void generateJwtToken_shouldReturnToken() {
        Authentication auth = buildAuth("test@test.com");

        String token = jwtUtils.generateJwtToken(auth);

        assertThat(token).isNotNull().isNotEmpty();
    }

    @Test
    void getUserNameFromJwtToken_shouldReturnUsername() {
        Authentication auth = buildAuth("test@test.com");
        String token = jwtUtils.generateJwtToken(auth);

        String username = jwtUtils.getUserNameFromJwtToken(token);

        assertThat(username).isEqualTo("test@test.com");
    }

    @Test
    void validateJwtToken_shouldReturnTrue_whenTokenIsValid() {
        Authentication auth = buildAuth("test@test.com");
        String token = jwtUtils.generateJwtToken(auth);

        boolean isValid = jwtUtils.validateJwtToken(token);

        assertThat(isValid).isTrue();
    }

    @Test
    void validateJwtToken_shouldReturnFalse_whenTokenIsMalformed() {
        boolean isValid = jwtUtils.validateJwtToken("invalid-token");
        assertThat(isValid).isFalse();
    }

    @Test
    void validateJwtToken_shouldReturnFalse_whenTokenIsEmpty() {
        boolean isValid = jwtUtils.validateJwtToken("");
        assertThat(isValid).isFalse();
    }

    @Test
    void validateJwtToken_shouldReturnFalse_whenSignatureIsInvalid() {
        Authentication auth = buildAuth("test@test.com");
        String token = jwtUtils.generateJwtToken(auth);

        // Tamper with the token signature
        String tamperedToken = token.substring(0, token.length() - 5) + "AAAAA";

        boolean isValid = jwtUtils.validateJwtToken(tamperedToken);
        assertThat(isValid).isFalse();
    }
}