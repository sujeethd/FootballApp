package com.shrank.footballapp.web;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleBadRequest(
            IllegalArgumentException ex,
            HttpServletRequest request
    ) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiError> handleIllegalState(
            IllegalStateException ex,
            HttpServletRequest request
    ) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), request);
    }

    @ExceptionHandler(RestClientResponseException.class)
    public ResponseEntity<ApiError> handleUpstreamHttp(
            RestClientResponseException ex,
            HttpServletRequest request
    ) {
        String message = "Upstream API error: " + ex.getStatusCode().value();
        return buildError(HttpStatus.BAD_GATEWAY, message, request);
    }

    @ExceptionHandler(RestClientException.class)
    public ResponseEntity<ApiError> handleUpstream(
            RestClientException ex,
            HttpServletRequest request
    ) {
        return buildError(HttpStatus.BAD_GATEWAY, "Upstream API request failed", request);
    }

    private ResponseEntity<ApiError> buildError(
            HttpStatus status,
            String message,
            HttpServletRequest request
    ) {
        ApiError error = new ApiError(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI()
        );
        return ResponseEntity.status(status).body(error);
    }

    record ApiError(
            Instant timestamp,
            int status,
            String error,
            String message,
            String path
    ) {}
}
