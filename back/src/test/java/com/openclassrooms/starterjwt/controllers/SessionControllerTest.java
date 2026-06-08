package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SessionRepository sessionRepository;

    @MockitoBean
    private UserRepository userRepository;

    private Session buildSession() {
        Session session = new Session();
        session.setId(1L);
        session.setName("Yoga");
        session.setDescription("Yoga session");
        session.setDate(new Date());
        session.setUsers(new ArrayList<>());
        return session;
    }

    @Test
    @WithMockUser
    void findById_shouldReturnSession() throws Exception {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(buildSession()));

        mockMvc.perform(get("/api/session/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Yoga"));
    }

    @Test
    @WithMockUser
    void findById_shouldReturn404_whenNotFound() throws Exception {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/session/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void findById_shouldReturn400_whenInvalidId() throws Exception {
        mockMvc.perform(get("/api/session/invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void findAll_shouldReturnAllSessions() throws Exception {
        when(sessionRepository.findAll()).thenReturn(Arrays.asList(buildSession(), buildSession()));

        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @WithMockUser
    void create_shouldReturnCreatedSession() throws Exception {
        SessionDto dto = new SessionDto();
        dto.setName("New Yoga");
        dto.setDescription("Description");
        dto.setDate(new Date());
        dto.setTeacher_id(1L);
        dto.setUsers(new ArrayList<>());

        when(sessionRepository.save(any(Session.class))).thenAnswer(inv -> inv.getArgument(0));

        mockMvc.perform(post("/api/session")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Yoga"));
    }

    @Test
    @WithMockUser
    void update_shouldReturnUpdatedSession() throws Exception {
        SessionDto dto = new SessionDto();
        dto.setName("Updated");
        dto.setDescription("Updated desc");
        dto.setDate(new Date());
        dto.setTeacher_id(1L);
        dto.setUsers(new ArrayList<>());

        when(sessionRepository.save(any(Session.class))).thenAnswer(inv -> inv.getArgument(0));

        mockMvc.perform(put("/api/session/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated"));
    }

    @Test
    @WithMockUser
    void delete_shouldReturnOk() throws Exception {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(buildSession()));

        mockMvc.perform(delete("/api/session/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void delete_shouldReturn404_whenNotFound() throws Exception {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/session/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void participate_shouldReturnOk() throws Exception {
        com.openclassrooms.starterjwt.models.User user = new com.openclassrooms.starterjwt.models.User();
        user.setId(2L);

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(buildSession()));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        mockMvc.perform(post("/api/session/1/participate/2"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void unParticipate_shouldReturnOk() throws Exception {
        com.openclassrooms.starterjwt.models.User user = new com.openclassrooms.starterjwt.models.User();
        user.setId(2L);

        Session session = buildSession();
        session.getUsers().add(user);

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        mockMvc.perform(delete("/api/session/1/participate/2"))
                .andExpect(status().isOk());
    }
}