package com.taskmanager.service;

import com.taskmanager.dto.ProjectDTO;
import com.taskmanager.model.Project;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public List<Project> getUserProjects(String userId) {
        return projectRepository.findByUserId(userId);
    }

    public Project createProject(ProjectDTO dto, String userId) {
        Project project = new Project();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setUserId(userId);
        return projectRepository.save(project);
    }

    public Project getProject(String id, String userId) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if (!project.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        return project;
    }

    public Project updateProject(String id, ProjectDTO dto, String userId) {
        Project project = getProject(id, userId);
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        return projectRepository.save(project);
    }

    public void deleteProject(String id, String userId) {
        Project project = getProject(id, userId);
        taskRepository.deleteByProjectId(id);
        projectRepository.delete(project);
    }
}
