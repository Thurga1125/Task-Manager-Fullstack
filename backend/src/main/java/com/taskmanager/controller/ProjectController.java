package com.taskmanager.controller;

import com.taskmanager.dto.PageResponse;
import com.taskmanager.dto.ProjectDTO;
import com.taskmanager.model.Project;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Manage projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserRepository userRepository;

    private String getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }

    @GetMapping
    @Operation(summary = "Get paginated list of projects for the current user")
    public ResponseEntity<PageResponse<Project>> getProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "") String search,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.getUserProjects(getUserId(userDetails), page, size, search));
    }

    @PostMapping
    @Operation(summary = "Create a new project")
    public ResponseEntity<Project> createProject(
            @Valid @RequestBody ProjectDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.createProject(dto, getUserId(userDetails)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single project by ID")
    public ResponseEntity<Project> getProject(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.getProject(id, getUserId(userDetails)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a project's name and description")
    public ResponseEntity<Project> updateProject(
            @PathVariable String id,
            @Valid @RequestBody ProjectDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.updateProject(id, dto, getUserId(userDetails)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a project and all its tasks")
    public ResponseEntity<Void> deleteProject(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        projectService.deleteProject(id, getUserId(userDetails));
        return ResponseEntity.noContent().build();
    }
}
