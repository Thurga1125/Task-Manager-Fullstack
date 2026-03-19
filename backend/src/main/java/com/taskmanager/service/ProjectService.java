package com.taskmanager.service;

import com.taskmanager.dto.PageResponse;
import com.taskmanager.dto.ProjectDTO;
import com.taskmanager.exception.ForbiddenException;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.model.Project;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.util.SanitizationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final ActivityLogService activityLogService;

    public PageResponse<Project> getUserProjects(String userId, int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Project> projectsPage = (search == null || search.isBlank())
                ? projectRepository.findByUserId(userId, pageable)
                : projectRepository.findByUserIdAndNameContainingIgnoreCase(userId, search.trim(), pageable);

        return new PageResponse<>(projectsPage.getContent(), page, size,
                projectsPage.getTotalElements(), projectsPage.getTotalPages(), projectsPage.isLast());
    }

    public Project createProject(ProjectDTO dto, String userId) {
        Project project = new Project();
        project.setName(SanitizationUtil.sanitize(dto.getName()));
        project.setDescription(SanitizationUtil.sanitize(dto.getDescription()));
        project.setUserId(userId);
        Project saved = projectRepository.save(project);
        activityLogService.log(userId, "PROJECT", saved.getId(), "CREATED",
                "Created project '" + saved.getName() + "'", saved.getId());
        return saved;
    }

    public Project getProject(String id, String userId) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        if (!project.getUserId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to access this project");
        }
        return project;
    }

    public Project updateProject(String id, ProjectDTO dto, String userId) {
        Project project = getProject(id, userId);
        project.setName(SanitizationUtil.sanitize(dto.getName()));
        project.setDescription(SanitizationUtil.sanitize(dto.getDescription()));
        Project saved = projectRepository.save(project);
        activityLogService.log(userId, "PROJECT", saved.getId(), "UPDATED",
                "Updated project '" + saved.getName() + "'", saved.getId());
        return saved;
    }

    public void deleteProject(String id, String userId) {
        Project project = getProject(id, userId);
        activityLogService.log(userId, "PROJECT", id, "DELETED",
                "Deleted project '" + project.getName() + "'", id);
        taskRepository.deleteByProjectId(id);
        projectRepository.delete(project);
    }
}
