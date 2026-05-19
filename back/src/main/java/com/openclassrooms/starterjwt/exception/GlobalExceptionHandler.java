package com.openclassrooms.starterjwt.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NumberFormatException.class)
    public ResponseEntity<?> handleNumberFormatException() {
        return ResponseEntity.badRequest().build();
    }

}
