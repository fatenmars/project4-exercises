package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserDetailsImplTest {

    @Test
    void shouldBuildUserDetails() {
        UserDetailsImpl user = UserDetailsImpl.builder()
                .id(1L)
                .username("test@test.com")
                .firstName("John")
                .lastName("Doe")
                .password("pwd")
                .admin(true)
                .build();

        assertThat(user.getId()).isEqualTo(1L);
        assertThat(user.getUsername()).isEqualTo("test@test.com");
        assertThat(user.getFirstName()).isEqualTo("John");
        assertThat(user.getLastName()).isEqualTo("Doe");
        assertThat(user.getPassword()).isEqualTo("pwd");
        assertThat(user.getAdmin()).isTrue();
    }

    @Test
    void shouldReturnEmptyAuthorities() {
        UserDetailsImpl user = UserDetailsImpl.builder().username("test").build();
        assertThat(user.getAuthorities()).isEmpty();
    }

    @Test
    void shouldReturnTrueForAccountFlags() {
        UserDetailsImpl user = UserDetailsImpl.builder().username("test").build();
        assertThat(user.isAccountNonExpired()).isTrue();
        assertThat(user.isAccountNonLocked()).isTrue();
        assertThat(user.isCredentialsNonExpired()).isTrue();
        assertThat(user.isEnabled()).isTrue();
    }

    @Test
    void equals_shouldReturnTrue_forSameId() {
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(1L).username("a").build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(1L).username("b").build();
        assertThat(user1).isEqualTo(user2);
    }

    @Test
    void equals_shouldReturnFalse_forDifferentId() {
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(2L).build();
        assertThat(user1).isNotEqualTo(user2);
    }

    @Test
    void equals_shouldReturnFalse_forDifferentClass() {
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();
        assertThat(user).isNotEqualTo("string");
    }

    @Test
    void equals_shouldReturnTrue_forSameInstance() {
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();
        assertThat(user).isEqualTo(user);
    }
}