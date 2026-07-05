package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-29T17:27:20+0200",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toEntity(UserDto dto) {
        if ( dto == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.admin( dto.isAdmin() );
        user.createdAt( dto.getCreatedAt() );
        user.email( dto.getEmail() );
        user.firstName( dto.getFirstName() );
        user.id( dto.getId() );
        user.lastName( dto.getLastName() );
        user.password( dto.getPassword() );
        user.updatedAt( dto.getUpdatedAt() );

        return user.build();
    }

    @Override
    public UserDto toDto(User entity) {
        if ( entity == null ) {
            return null;
        }

        UserDto userDto = new UserDto();

        userDto.setAdmin( entity.isAdmin() );
        userDto.setCreatedAt( entity.getCreatedAt() );
        userDto.setEmail( entity.getEmail() );
        userDto.setFirstName( entity.getFirstName() );
        userDto.setId( entity.getId() );
        userDto.setLastName( entity.getLastName() );
        userDto.setPassword( entity.getPassword() );
        userDto.setUpdatedAt( entity.getUpdatedAt() );

        return userDto;
    }

    @Override
    public List<User> toEntity(List<UserDto> dtoList) {
        if ( dtoList == null ) {
            return null;
        }

        List<User> list = new ArrayList<User>( dtoList.size() );
        for ( UserDto userDto : dtoList ) {
            list.add( toEntity( userDto ) );
        }

        return list;
    }

    @Override
    public List<UserDto> toDto(List<User> entityList) {
        if ( entityList == null ) {
            return null;
        }

        List<UserDto> list = new ArrayList<UserDto>( entityList.size() );
        for ( User user : entityList ) {
            list.add( toDto( user ) );
        }

        return list;
    }
}
