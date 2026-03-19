package com.taskmanager.controller;

import com.taskmanager.model.ActivityLog;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.service.ActivityLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
@Tag(name = "Activity Log", description = "Retrieve audit trail of user actions")
public class ActivityLogController {

    private final ActivityLogService activityLogService;
    private final UserRepository userRepository;

    private String getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }

    @GetMapping
    @Operation(summary = "Get activity log for the current user")
    public ResponseEntity<List<ActivityLog>> getUserActivity(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(activityLogService.getLogsForUser(getUserId(userDetails)));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get activity log for a specific project")
    public ResponseEntity<List<ActivityLog>> getProjectActivity(
            @PathVariable String projectId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(activityLogService.getLogsForProject(projectId));
    }
}
