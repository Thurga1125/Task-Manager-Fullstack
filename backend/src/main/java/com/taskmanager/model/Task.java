package com.taskmanager.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "tasks")
public class Task {
    @Id
    private String id;
    private String title;
    private String description;
    private String status = "TO_DO"; // TO_DO, IN_PROGRESS, DONE
    private String projectId;
    private String userId;
    private LocalDateTime createdAt = LocalDateTime.now();
}
