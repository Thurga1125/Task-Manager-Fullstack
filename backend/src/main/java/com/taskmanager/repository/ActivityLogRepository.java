package com.taskmanager.repository;

import com.taskmanager.model.ActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {

    List<ActivityLog> findByUserIdOrderByCreatedAtDesc(String userId);

    List<ActivityLog> findByProjectIdOrderByCreatedAtDesc(String projectId);

    List<ActivityLog> findByEntityIdAndEntityTypeOrderByCreatedAtDesc(String entityId, String entityType);
}
