package com.taskmanager.service;

import com.taskmanager.dto.PageResponse;
import com.taskmanager.dto.TaskDTO;
import com.taskmanager.exception.ForbiddenException;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.model.Task;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.util.SanitizationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ActivityLogService activityLogService;

    public PageResponse<Task> getProjectTasks(String projectId, String userId, int page, int size, String search) {
        projectRepository.findById(projectId)
                .filter(p -> p.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Task> tasksPage = (search == null || search.isBlank())
                ? taskRepository.findByProjectId(projectId, pageable)
                : taskRepository.findByProjectIdAndTitleContainingIgnoreCase(projectId, search.trim(), pageable);

        return new PageResponse<>(tasksPage.getContent(), page, size,
                tasksPage.getTotalElements(), tasksPage.getTotalPages(), tasksPage.isLast());
    }

    public Task getTask(String taskId, String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (!task.getUserId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to view this task");
        }
        return task;
    }

    public Task createTask(String projectId, TaskDTO dto, String userId) {
        projectRepository.findById(projectId)
                .filter(p -> p.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Task task = new Task();
        task.setTitle(SanitizationUtil.sanitize(dto.getTitle()));
        task.setDescription(SanitizationUtil.sanitize(dto.getDescription()));
        task.setStatus(dto.getStatus() != null ? dto.getStatus() : "TO_DO");
        task.setPriority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM");
        task.setDueDate(dto.getDueDate());
        task.setAssignee(SanitizationUtil.sanitize(dto.getAssignee()));
        task.setProjectId(projectId);
        task.setUserId(userId);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        Task saved = taskRepository.save(task);
        activityLogService.log(userId, "TASK", saved.getId(), "CREATED",
                "Created task '" + saved.getTitle() + "'", projectId);
        return saved;
    }

    public Task updateTask(String taskId, TaskDTO dto, String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (!task.getUserId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to update this task");
        }
        if (dto.getTitle() != null) task.setTitle(SanitizationUtil.sanitize(dto.getTitle()));
        if (dto.getDescription() != null) task.setDescription(SanitizationUtil.sanitize(dto.getDescription()));
        if (dto.getStatus() != null) task.setStatus(dto.getStatus());
        if (dto.getPriority() != null) task.setPriority(dto.getPriority());
        if (dto.getAssignee() != null) task.setAssignee(SanitizationUtil.sanitize(dto.getAssignee()));
        if (dto.getDueDate() != null) task.setDueDate(dto.getDueDate());
        task.setUpdatedAt(LocalDateTime.now());
        Task saved = taskRepository.save(task);
        activityLogService.log(userId, "TASK", saved.getId(), "UPDATED",
                "Updated task '" + saved.getTitle() + "'", saved.getProjectId());
        return saved;
    }

    public void deleteTask(String taskId, String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (!task.getUserId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to delete this task");
        }
        activityLogService.log(userId, "TASK", taskId, "DELETED",
                "Deleted task '" + task.getTitle() + "'", task.getProjectId());
        taskRepository.delete(task);
    }
}
