package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class TeacherMapperTest {

    private final TeacherMapper mapper = Mappers.getMapper(TeacherMapper.class);

    @Test
    void toDto_shouldMapTeacherToDto() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("John");
        teacher.setLastName("Doe");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());

        TeacherDto dto = mapper.toDto(teacher);

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getFirstName()).isEqualTo("John");
        assertThat(dto.getLastName()).isEqualTo("Doe");
    }

    @Test
    void toEntity_shouldMapDtoToTeacher() {
        TeacherDto dto = new TeacherDto();
        dto.setId(1L);
        dto.setFirstName("John");
        dto.setLastName("Doe");

        Teacher teacher = mapper.toEntity(dto);

        assertThat(teacher.getId()).isEqualTo(1L);
        assertThat(teacher.getFirstName()).isEqualTo("John");
    }

    @Test
    void toDto_shouldMapList() {
        Teacher t1 = new Teacher();
        t1.setId(1L);
        t1.setFirstName("A");
        t1.setLastName("A");

        Teacher t2 = new Teacher();
        t2.setId(2L);
        t2.setFirstName("B");
        t2.setLastName("B");

        List<TeacherDto> dtos = mapper.toDto(Arrays.asList(t1, t2));

        assertThat(dtos).hasSize(2);
    }

    @Test
    void toEntity_shouldMapList() {
        TeacherDto dto = new TeacherDto();
        dto.setId(1L);
        dto.setFirstName("A");
        dto.setLastName("A");

        List<Teacher> teachers = mapper.toEntity(Arrays.asList(dto));

        assertThat(teachers).hasSize(1);
    }
}