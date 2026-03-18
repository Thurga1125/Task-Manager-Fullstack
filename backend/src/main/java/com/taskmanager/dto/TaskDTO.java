package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskDTO {
    @NotBlank
    @Size(max = 200)
    private String title;
    @Size(max = 1000)
    private String description;
    private String status;
}
