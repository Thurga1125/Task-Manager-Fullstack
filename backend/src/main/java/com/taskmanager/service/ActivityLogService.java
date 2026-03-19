package com.taskmanager.service;

import com.taskmanager.model.ActivityLog;
import com.taskmanager.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    @Async
    public void log(String userId, String entityType, String entityId, String action, String description, String projectId) {
        ActivityLog log = new ActivityLog();
        log.setUserId(userId);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setAction(action);
        log.setDescription(description);
        log.setProjectId(projectId);
        activityLogRepository.save(log);
    }

    public List<ActivityLog> getLogsForUser(String userId) {
        return activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<ActivityLog> getLogsForProject(String projectId) {
        return activityLogRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }
}
