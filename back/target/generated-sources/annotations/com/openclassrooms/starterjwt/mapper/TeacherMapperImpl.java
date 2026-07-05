package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-29T17:27:19+0200",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class TeacherMapperImpl implements TeacherMapper {

    @Override
    public Teacher toEntity(TeacherDto dto) {
        if ( dto == null ) {
            return null;
        }

        Teacher.TeacherBuilder teacher = Teacher.builder();

        teacher.createdAt( dto.getCreatedAt() );
        teacher.firstName( dto.getFirstName() );
        teacher.id( dto.getId() );
        teacher.lastName( dto.getLastName() );
        teacher.updatedAt( dto.getUpdatedAt() );

        return teacher.build();
    }

    @Override
    public TeacherDto toDto(Teacher entity) {
        if ( entity == null ) {
            return null;
        }

        TeacherDto teacherDto = new TeacherDto();

        teacherDto.setCreatedAt( entity.getCreatedAt() );
        teacherDto.setFirstName( entity.getFirstName() );
        teacherDto.setId( entity.getId() );
        teacherDto.setLastName( entity.getLastName() );
        teacherDto.setUpdatedAt( entity.getUpdatedAt() );

        return teacherDto;
    }

    @Override
    public List<Teacher> toEntity(List<TeacherDto> dtoList) {
        if ( dtoList == null ) {
            return null;
        }

        List<Teacher> list = new ArrayList<Teacher>( dtoList.size() );
        for ( TeacherDto teacherDto : dtoList ) {
            list.add( toEntity( teacherDto ) );
        }

        return list;
    }

    @Override
    public List<TeacherDto> toDto(List<Teacher> entityList) {
        if ( entityList == null ) {
            return null;
        }

        List<TeacherDto> list = new ArrayList<TeacherDto>( entityList.size() );
        for ( Teacher teacher : entityList ) {
            list.add( toDto( teacher ) );
        }

        return list;
    }
}
