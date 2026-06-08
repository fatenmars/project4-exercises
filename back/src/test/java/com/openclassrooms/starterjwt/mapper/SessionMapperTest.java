package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SessionMapperTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private UserService userService;

    @InjectMocks
    private SessionMapperImpl mapper;

    @Test
    void toDto_shouldMapSessionToDto() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);

        User user1 = new User();
        user1.setId(2L);
        User user2 = new User();
        user2.setId(3L);

        Session session = new Session();
        session.setId(1L);
        session.setName("Yoga");
        session.setDescription("Desc");
        session.setDate(new Date());
        session.setTeacher(teacher);
        session.setUsers(Arrays.asList(user1, user2));

        SessionDto dto = mapper.toDto(session);

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getName()).isEqualTo("Yoga");
        assertThat(dto.getTeacher_id()).isEqualTo(1L);
        assertThat(dto.getUsers()).containsExactly(2L, 3L);
    }

    @Test
    void toEntity_shouldMapDtoToSession() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);

        User user = new User();
        user.setId(2L);

        SessionDto dto = new SessionDto();
        dto.setId(1L);
        dto.setName("Yoga");
        dto.setDescription("Desc");
        dto.setDate(new Date());
        dto.setTeacher_id(1L);
        dto.setUsers(new ArrayList<>(List.of(2L)));

        when(teacherService.findById(1L)).thenReturn(teacher);
        when(userService.findById(2L)).thenReturn(user);

        Session session = mapper.toEntity(dto);

        assertThat(session.getId()).isEqualTo(1L);
        assertThat(session.getTeacher()).isEqualTo(teacher);
        assertThat(session.getUsers()).containsExactly(user);
    }

    @Test
    void toDto_shouldHandleNullTeacher() {
        Session session = new Session();
        session.setId(1L);
        session.setName("Yoga");
        session.setDescription("Desc");
        session.setDate(new Date());
        session.setUsers(new ArrayList<>());

        SessionDto dto = mapper.toDto(session);

        assertThat(dto.getTeacher_id()).isNull();
    }

    @Test
    void toEntity_shouldHandleNullTeacherId() {
        SessionDto dto = new SessionDto();
        dto.setId(1L);
        dto.setName("Yoga");
        dto.setDescription("Desc");
        dto.setDate(new Date());
        dto.setUsers(new ArrayList<>());

        Session session = mapper.toEntity(dto);

        assertThat(session.getTeacher()).isNull();
    }

    @Test
    void toDto_shouldMapList() {
        Session s1 = new Session();
        s1.setId(1L);
        s1.setName("S1");
        s1.setDescription("D1");
        s1.setDate(new Date());
        s1.setUsers(new ArrayList<>());

        Session s2 = new Session();
        s2.setId(2L);
        s2.setName("S2");
        s2.setDescription("D2");
        s2.setDate(new Date());
        s2.setUsers(new ArrayList<>());

        List<SessionDto> dtos = mapper.toDto(Arrays.asList(s1, s2));

        assertThat(dtos).hasSize(2);
    }
}