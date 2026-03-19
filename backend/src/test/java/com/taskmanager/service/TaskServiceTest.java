package com.taskmanager.service;

import com.taskmanager.dto.TaskDTO;
import com.taskmanager.exception.ForbiddenException;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.model.Project;
import com.taskmanager.model.Task;
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
class TaskServiceTest {

    @Mock private TaskRepository taskRepository;
    @Mock private ProjectRepository projectRepository;
    @Mock private ActivityLogService activityLogService;

    @InjectMocks private TaskService taskService;

    private Task task;
    private Project project;
    private static final String USER_ID = "user-1";
    private static final String PROJECT_ID = "project-1";
    private static final String TASK_ID = "task-1";

    @BeforeEach
    void setUp() {
        project = new Project();
        project.setId(PROJECT_ID);
        project.setUserId(USER_ID);

        task = new Task();
        task.setId(TASK_ID);
        task.setTitle("Test Task");
        task.setDescription("Task description");
        task.setStatus("TO_DO");
        task.setPriority("MEDIUM");
        task.setProjectId(PROJECT_ID);
        task.setUserId(USER_ID);
    }

    // ── createTask ────────────────────────────────────────────────────────────

    @Test
    void createTask_savesAndReturnsTask() {
        TaskDTO dto = new TaskDTO();
        dto.setTitle("New Task");
        dto.setDescription("Some desc");
        when(projectRepository.findById(PROJECT_ID)).thenReturn(Optional.of(project));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        Task result = taskService.createTask(PROJECT_ID, dto, USER_ID);

        assertThat(result.getTitle()).isEqualTo("New Task");
        assertThat(result.getStatus()).isEqualTo("TO_DO");
        assertThat(result.getPriority()).isEqualTo("MEDIUM");
        verify(activityLogService).log(eq(USER_ID), eq("TASK"), any(), eq("CREATED"), anyString(), eq(PROJECT_ID));
    }

    @Test
    void createTask_throwsNotFound_whenProjectMissing() {
        when(projectRepository.findById(PROJECT_ID)).thenReturn(Optional.empty());
        TaskDTO dto = new TaskDTO();
        dto.setTitle("Task");

        assertThatThrownBy(() -> taskService.createTask(PROJECT_ID, dto, USER_ID))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(taskRepository, never()).save(any());
    }

    @Test
    void createTask_throwsForbidden_whenWrongProjectOwner() {
        project.setUserId("other-user");
        when(projectRepository.findById(PROJECT_ID)).thenReturn(Optional.of(project));
        TaskDTO dto = new TaskDTO();
        dto.setTitle("Task");

        assertThatThrownBy(() -> taskService.createTask(PROJECT_ID, dto, USER_ID))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void createTask_sanitizesHtmlInput() {
        TaskDTO dto = new TaskDTO();
        dto.setTitle("<script>xss()</script>My Task");
        dto.setAssignee("<b>John</b>");
        when(projectRepository.findById(PROJECT_ID)).thenReturn(Optional.of(project));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        Task result = taskService.createTask(PROJECT_ID, dto, USER_ID);

        assertThat(result.getTitle()).doesNotContain("<script>");
        assertThat(result.getAssignee()).doesNotContain("<b>");
    }

    // ── updateTask ────────────────────────────────────────────────────────────

    @Test
    void updateTask_updatesOnlyProvidedFields() {
        TaskDTO dto = new TaskDTO();
        dto.setStatus("DONE");
        when(taskRepository.findById(TASK_ID)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        Task result = taskService.updateTask(TASK_ID, dto, USER_ID);

        assertThat(result.getStatus()).isEqualTo("DONE");
        assertThat(result.getTitle()).isEqualTo("Test Task"); // unchanged
        verify(activityLogService).log(eq(USER_ID), eq("TASK"), eq(TASK_ID), eq("UPDATED"), anyString(), any());
    }

    @Test
    void updateTask_throwsNotFound_whenTaskMissing() {
        when(taskRepository.findById(TASK_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.updateTask(TASK_ID, new TaskDTO(), USER_ID))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Task not found");
    }

    @Test
    void updateTask_throwsForbidden_whenWrongUser() {
        when(taskRepository.findById(TASK_ID)).thenReturn(Optional.of(task));

        assertThatThrownBy(() -> taskService.updateTask(TASK_ID, new TaskDTO(), "hacker"))
                .isInstanceOf(ForbiddenException.class);
        verify(taskRepository, never()).save(any());
    }

    // ── deleteTask ────────────────────────────────────────────────────────────

    @Test
    void deleteTask_deletesTask() {
        when(taskRepository.findById(TASK_ID)).thenReturn(Optional.of(task));

        taskService.deleteTask(TASK_ID, USER_ID);

        verify(taskRepository).delete(task);
        verify(activityLogService).log(eq(USER_ID), eq("TASK"), eq(TASK_ID), eq("DELETED"), anyString(), any());
    }

    @Test
    void deleteTask_throwsForbidden_whenWrongUser() {
        when(taskRepository.findById(TASK_ID)).thenReturn(Optional.of(task));

        assertThatThrownBy(() -> taskService.deleteTask(TASK_ID, "other"))
                .isInstanceOf(ForbiddenException.class);
        verify(taskRepository, never()).delete(any());
    }

    // ── getProjectTasks ───────────────────────────────────────────────────────

    @Test
    void getProjectTasks_returnsPaginatedResult() {
        Page<Task> page = new PageImpl<>(List.of(task), PageRequest.of(0, 100), 1);
        when(projectRepository.findById(PROJECT_ID)).thenReturn(Optional.of(project));
        when(taskRepository.findByProjectId(eq(PROJECT_ID), any(Pageable.class))).thenReturn(page);

        var response = taskService.getProjectTasks(PROJECT_ID, USER_ID, 0, 100, null);

        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getTotalElements()).isEqualTo(1);
    }
}
