package com.taskmanager.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "activity_logs")
public class ActivityLog {

    @Id
    private String id;

    /** The user who performed the action */
    private String userId;

    /** Type of entity affected: PROJECT or TASK */
    private String entityType;

    /** ID of the affected entity */
    private String entityId;

    /** Human-readable action: CREATED, UPDATED, DELETED */
    private String action;

    /** Short description, e.g. "Created project 'My App'" */
    private String description;

    /** Optional reference to the parent project (for task activities) */
    private String projectId;

    private LocalDateTime createdAt = LocalDateTime.now();
}
