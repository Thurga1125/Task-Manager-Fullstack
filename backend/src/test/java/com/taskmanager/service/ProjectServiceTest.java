package com.taskmanager.service;

import com.taskmanager.dto.PageResponse;
import com.taskmanager.dto.ProjectDTO;
import com.taskmanager.exception.ForbiddenException;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.model.Project;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock private ProjectRepository projectRepository;
    @Mock private TaskRepository taskRepository;
    @Mock private ActivityLogService activityLogService;

    @InjectMocks private ProjectService projectService;

    private Project project;
    private static final String USER_ID = "user-1";
    private static final String PROJECT_ID = "project-1";

    @BeforeEach
    void setUp() {
        project = new Project();
        project.setId(PROJECT_ID);
        project.setName("Test Project");
        project.setDescription("Test description");
        project.setUserId(USER_ID);
    }

    // ── getProject ────────────────────────────────────────────────────────────

    @Test
    void getProject_returnsProject_whenOwner() {
        when(projectRepository.findById(PROJECT_ID)).thenReturn(Optional.of(project));

        Project result = projectService.getProject(PROJECT_ID, USER_ID);

        assertThat(result).isEqualTo(project);
    }

    @Test
    void getProject_throwsNotFound_whenMissing() {
        when(projectRepository.findById(PROJECT_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.getProject(PROJECT_ID, USER_ID))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Project not found");
    }

    @Test
    void getProject_throwsForbidden_whenWrongUser() {
        when(projectRepository.findById(PROJECT_ID)).thenReturn(Optional.of(project));

        assertThatThrownBy(() -> projectService.getProject(PROJECT_ID, "other-user"))
                .isInstanceOf(ForbiddenException.class);
    }

    // ── createProject ─────────────────────────────────────────────────────────

    @Test
    void createProject_savesAndReturnsProject() {
        ProjectDTO dto = new ProjectDTO();
        dto.setName("New Project");
        dto.setDescription("Some description");
        when(projectRepository.save(any(Project.class))).thenAnswer(inv -> inv.getArgument(0));

        Project result = projectService.createProject(dto, USER_ID);

        assertThat(result.getName()).isEqualTo("New Project");
        assertThat(result.getUserId()).isEqualTo(USER_ID);
        verify(activityLogService).log(eq(USER_ID), eq("PROJECT"), any(), eq("CREATED"), anyString(), any());
    }

    @Test
    void createProject_sanitizesHtmlInput() {
        ProjectDTO dto = new ProjectDTO();
        dto.setName("<script>alert('xss')</script>My Project");
        dto.setDescription("<b>Bold</b> description");
        when(projectRepository.save(any(Project.class))).thenAnswer(inv -> inv.getArgument(0));

        Project result = projectService.createProject(dto, USER_ID);

        assertThat(result.getName()).doesNotContain("<script>");
        assertThat(result.getDescription()).doesNotContain("<b>");
    }

    // ── updateProject ─────────────────────────────────────────────────────────

    @Test
    void updateProject_updatesFieldsAndLogs() {
        ProjectDTO dto = new ProjectDTO();
        dto.setName("Updated Name");
        dto.setDescription("Updated desc");
        when(projectRepository.findById(PROJECT_ID)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenAnswer(inv -> inv.getArgument(0));

        Project result = projectService.updateProject(PROJECT_ID, dto, USER_ID);

        assertThat(result.getName()).isEqualTo("Updated Name");
        verify(activityLogService).log(eq(USER_ID), eq("PROJECT"), eq(PROJECT_ID), eq("UPDATED"), anyString(), any());
    }

    @Test
    void updateProject_throwsForbidden_whenWrongUser() {
        when(projectRepository.findById(PROJECT_ID)).thenReturn(Optional.of(project));
        ProjectDTO dto = new ProjectDTO();
        dto.setName("Hacked");

        assertThatThrownBy(() -> projectService.updateProject(PROJECT_ID, dto, "hacker"))
                .isInstanceOf(ForbiddenException.class);
        verify(projectRepository, never()).save(any());
    }

    // ── deleteProject ─────────────────────────────────────────────────────────

    @Test
    void deleteProject_deletesProjectAndTasks() {
        when(projectRepository.findById(PROJECT_ID)).thenReturn(Optional.of(project));

        projectService.deleteProject(PROJECT_ID, USER_ID);

        verify(taskRepository).deleteByProjectId(PROJECT_ID);
        verify(projectRepository).delete(project);
        verify(activityLogService).log(eq(USER_ID), eq("PROJECT"), eq(PROJECT_ID), eq("DELETED"), anyString(), any());
    }

    // ── getUserProjects ───────────────────────────────────────────────────────

    @Test
    void getUserProjects_returnsPaginatedResponse() {
        Page<Project> page = new PageImpl<>(List.of(project), PageRequest.of(0, 9), 1);
        when(projectRepository.findByUserId(eq(USER_ID), any(Pageable.class))).thenReturn(page);

        PageResponse<Project> response = projectService.getUserProjects(USER_ID, 0, 9, null);

        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getTotalElements()).isEqualTo(1);
    }

    @Test
    void getUserProjects_usesSearchQuery_whenProvided() {
        Page<Project> page = new PageImpl<>(List.of(project), PageRequest.of(0, 9), 1);
        when(projectRepository.findByUserIdAndNameContainingIgnoreCase(eq(USER_ID), eq("test"), any(Pageable.class)))
                .thenReturn(page);

        PageResponse<Project> response = projectService.getUserProjects(USER_ID, 0, 9, "test");

        assertThat(response.getContent()).hasSize(1);
        verify(projectRepository, never()).findByUserId(any(), any());
    }
}
