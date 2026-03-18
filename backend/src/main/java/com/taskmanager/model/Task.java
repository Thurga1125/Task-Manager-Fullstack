package com.taskmanager.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "tasks")
public class Task {
    @Id
    private String id;
    private String title;
    private String description;
    private String status = "TO_DO"; // TO_DO, IN_PROGRESS, DONE
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH
    private String assignee;
    private LocalDate dueDate;
    private String projectId;
    private String userId;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
