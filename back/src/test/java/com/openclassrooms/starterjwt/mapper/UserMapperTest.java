package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class UserMapperTest {

    private final UserMapper mapper = Mappers.getMapper(UserMapper.class);

    @Test
    void toDto_shouldMapUserToDto() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPassword("pwd");
        user.setAdmin(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        UserDto dto = mapper.toDto(user);

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getEmail()).isEqualTo("test@test.com");
        assertThat(dto.getFirstName()).isEqualTo("John");
    }

    @Test
    void toEntity_shouldMapDtoToUser() {
        UserDto dto = new UserDto();
        dto.setId(1L);
        dto.setEmail("test@test.com");
        dto.setFirstName("John");
        dto.setLastName("Doe");
        dto.setPassword("pwd");
        dto.setAdmin(false);
        dto.setCreatedAt(LocalDateTime.now());
        dto.setUpdatedAt(LocalDateTime.now());

        User user = mapper.toEntity(dto);

        assertThat(user.getId()).isEqualTo(1L);
        assertThat(user.getEmail()).isEqualTo("test@test.com");
    }

    @Test
    void toDto_shouldMapList() {
        User user1 = new User();
        user1.setId(1L);
        user1.setEmail("a@test.com");
        user1.setFirstName("A");
        user1.setLastName("A");
        user1.setPassword("pwd");
        user1.setAdmin(false);

        User user2 = new User();
        user2.setId(2L);
        user2.setEmail("b@test.com");
        user2.setFirstName("B");
        user2.setLastName("B");
        user2.setPassword("pwd");
        user2.setAdmin(false);

        List<UserDto> dtos = mapper.toDto(Arrays.asList(user1, user2));

        assertThat(dtos).hasSize(2);
    }

    @Test
    void toEntity_shouldMapList() {
        UserDto dto1 = new UserDto();
        dto1.setId(1L);
        dto1.setEmail("a@test.com");
        dto1.setFirstName("A");
        dto1.setLastName("A");
        dto1.setPassword("pwd");
        dto1.setAdmin(false);

        List<User> users = mapper.toEntity(Arrays.asList(dto1));

        assertThat(users).hasSize(1);
    }
}