package com.taskmanager.controller;

import com.taskmanager.dto.TaskDTO;
import com.taskmanager.model.Task;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    private String getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<Task>> getProjectTasks(@PathVariable String projectId,
                                                       @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.getProjectTasks(projectId, getUserId(userDetails)));
    }

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<Task> createTask(@PathVariable String projectId,
                                            @Valid @RequestBody TaskDTO dto,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.createTask(projectId, dto, getUserId(userDetails)));
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable String taskId,
                                            @RequestBody TaskDTO dto,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.updateTask(taskId, dto, getUserId(userDetails)));
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable String taskId,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        taskService.deleteTask(taskId, getUserId(userDetails));
        return ResponseEntity.noContent().build();
    }
}
