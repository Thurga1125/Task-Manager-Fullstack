package com.taskmanager.controller;

import com.taskmanager.dto.ProjectDTO;
import com.taskmanager.model.Project;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final UserRepository userRepository;

    private String getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }

    @GetMapping
    public ResponseEntity<List<Project>> getProjects(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.getUserProjects(getUserId(userDetails)));
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectDTO dto,
                                                  @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.createProject(dto, getUserId(userDetails)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable String id,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.getProject(id, getUserId(userDetails)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable String id,
                                                  @Valid @RequestBody ProjectDTO dto,
                                                  @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.updateProject(id, dto, getUserId(userDetails)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        projectService.deleteProject(id, getUserId(userDetails));
        return ResponseEntity.noContent().build();
    }
}
