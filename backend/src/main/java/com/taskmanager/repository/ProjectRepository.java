package com.taskmanager.repository;

import com.taskmanager.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByUserId(String userId);

    Page<Project> findByUserId(String userId, Pageable pageable);
    Page<Project> findByUserIdAndNameContainingIgnoreCase(String userId, String name, Pageable pageable);
}
