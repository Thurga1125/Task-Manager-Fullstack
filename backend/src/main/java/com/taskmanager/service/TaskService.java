package com.taskmanager.service;

import com.taskmanager.dto.TaskDTO;
import com.taskmanager.model.Task;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public List<Task> getProjectTasks(String projectId, String userId) {
        projectRepository.findById(projectId)
                .filter(p -> p.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));
        return taskRepository.findByProjectId(projectId);
    }

    public Task createTask(String projectId, TaskDTO dto, String userId) {
        projectRepository.findById(projectId)
                .filter(p -> p.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));
        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus() != null ? dto.getStatus() : "TO_DO");
        task.setProjectId(projectId);
        task.setUserId(userId);
        return taskRepository.save(task);
    }

    public Task updateTask(String taskId, TaskDTO dto, String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        if (dto.getTitle() != null) task.setTitle(dto.getTitle());
        if (dto.getDescription() != null) task.setDescription(dto.getDescription());
        if (dto.getStatus() != null) task.setStatus(dto.getStatus());
        return taskRepository.save(task);
    }

    public void deleteTask(String taskId, String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        taskRepository.delete(task);
    }
}
