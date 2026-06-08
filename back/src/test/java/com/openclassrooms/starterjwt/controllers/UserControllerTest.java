package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    @WithMockUser
    void findById_shouldReturnUser_whenExists() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPassword("pwd");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/user/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("test@test.com"));
    }

    @Test
    @WithMockUser
    void findById_shouldReturn404_whenNotExists() throws Exception {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/user/1"))
            .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void findById_shouldReturn400_whenIdIsInvalid() throws Exception {
        mockMvc.perform(get("/api/user/invalid"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "test@test.com")
    void delete_shouldReturnOk_whenUserIsOwner() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setPassword("pwd");
        user.setFirstName("John");
        user.setLastName("Doe");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        mockMvc.perform(delete("/api/user/1"))
            .andExpect(status().isOk());

        verify(userRepository).deleteById(1L);
    }

    @Test
    @WithMockUser(username = "other@test.com")
    void delete_shouldReturnUnauthorized_whenUserIsNotOwner() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setPassword("pwd");
        user.setFirstName("John");
        user.setLastName("Doe");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        mockMvc.perform(delete("/api/user/1"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void delete_shouldReturn404_whenUserNotFound() throws Exception {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/user/1"))
            .andExpect(status().isNotFound());
    }
}