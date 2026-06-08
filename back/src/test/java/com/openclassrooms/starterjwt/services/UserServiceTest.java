package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void delete_shouldCallRepositoryDeleteById() {
        userService.delete(1L);

        verify(userRepository).deleteById(1L);
    }

    @Test
    void findById_shouldReturnUser_whenUserExists() {
        User user = new User();
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User result = userService.findById(1L);

        assertThat(result).isEqualTo(user);
    }

    @Test
    void findById_shouldReturnNull_whenUserDoesNotExist() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        User result = userService.findById(1L);

        assertThat(result).isNull();
    }

    @Test
    void findByEmail_shouldReturnUser_whenUserExists() {
        User user = new User();
        user.setEmail("test@test.com");
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        User result = userService.findByEmail("test@test.com");

        assertThat(result).isEqualTo(user);
    }

    @Test
    void findByEmail_shouldReturnNull_whenUserDoesNotExist() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.empty());

        User result = userService.findByEmail("test@test.com");

        assertThat(result).isNull();
    }

    @Test
    void existsByEmail_shouldReturnTrue_whenUserExists() {
        when(userRepository.existsByEmail("test@test.com")).thenReturn(true);

        boolean result = userService.existsByEmail("test@test.com");

        assertThat(result).isTrue();
    }

    @Test
    void save_shouldCallRepositorySave() {
        User user = new User();
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.save(user);

        verify(userRepository).save(user);
        assertThat(result).isEqualTo(user);
    }

    @Test
    void register_shouldEncodePasswordAndSaveUser() {
        SignupRequest request = new SignupRequest();
        request.setEmail("test@test.com");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPassword("password");

        when(passwordEncoder.encode("password")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.register(request);

        verify(passwordEncoder).encode("password");
        verify(userRepository).save(any(User.class));
        assertThat(result.getPassword()).isEqualTo("encoded-password");
        assertThat(result.getEmail()).isEqualTo("test@test.com");
    }
}