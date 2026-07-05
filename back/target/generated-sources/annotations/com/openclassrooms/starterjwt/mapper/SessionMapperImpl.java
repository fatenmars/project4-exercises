package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-29T17:27:20+0200",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class SessionMapperImpl extends SessionMapper {

    @Override
    public List<Session> toEntity(List<SessionDto> dtoList) {
        if ( dtoList == null ) {
            return null;
        }

        List<Session> list = new ArrayList<Session>( dtoList.size() );
        for ( SessionDto sessionDto : dtoList ) {
            list.add( toEntity( sessionDto ) );
        }

        return list;
    }

    @Override
    public List<SessionDto> toDto(List<Session> entityList) {
        if ( entityList == null ) {
            return null;
        }

        List<SessionDto> list = new ArrayList<SessionDto>( entityList.size() );
        for ( Session session : entityList ) {
            list.add( toDto( session ) );
        }

        return list;
    }

    @Override
    public Session toEntity(SessionDto sessionDto) {
        if ( sessionDto == null ) {
            return null;
        }

        Session.SessionBuilder session = Session.builder();

        session.description( sessionDto.getDescription() );
        session.createdAt( sessionDto.getCreatedAt() );
        session.date( sessionDto.getDate() );
        session.id( sessionDto.getId() );
        session.name( sessionDto.getName() );
        session.updatedAt( sessionDto.getUpdatedAt() );

        session.teacher( sessionDto.getTeacher_id() != null ? this.teacherService.findById(sessionDto.getTeacher_id()) : null );
        session.users( Optional.ofNullable(sessionDto.getUsers()).orElseGet(Collections::emptyList).stream().map(user_id -> { User user = this.userService.findById(user_id); if (user != null) { return user; } return null; }).collect(Collectors.toList()) );

        return session.build();
    }

    @Override
    public SessionDto toDto(Session session) {
        if ( session == null ) {
            return null;
        }

        SessionDto sessionDto = new SessionDto();

        sessionDto.setDescription( session.getDescription() );
        sessionDto.setTeacher_id( sessionTeacherId( session ) );
        sessionDto.setCreatedAt( session.getCreatedAt() );
        sessionDto.setDate( session.getDate() );
        sessionDto.setId( session.getId() );
        sessionDto.setName( session.getName() );
        sessionDto.setUpdatedAt( session.getUpdatedAt() );

        sessionDto.setUsers( Optional.ofNullable(session.getUsers()).orElseGet(Collections::emptyList).stream().map(u -> u.getId()).collect(Collectors.toList()) );

        return sessionDto;
    }

    private Long sessionTeacherId(Session session) {
        Teacher teacher = session.getTeacher();
        if ( teacher == null ) {
            return null;
        }
        return teacher.getId();
    }
}
