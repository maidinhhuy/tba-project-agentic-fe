package com.tba.agentic.application.service;

import com.tba.agentic.application.usecase.GetProjectDetailUseCase;
import com.tba.agentic.domain.exception.ProjectNotFoundException;
import com.tba.agentic.domain.model.Project;
import com.tba.agentic.domain.model.Role;
import com.tba.agentic.domain.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetProjectDetailService implements GetProjectDetailUseCase {

    private final ProjectRepository projectRepository;

    @Override
    public Project execute(Query query) {
        if (query.requesterRole() == Role.ADMIN) {
            // Admin can view any project
            return projectRepository.findById(query.projectId())
                .orElseThrow(() -> new ProjectNotFoundException(query.projectId().value().toString()));
        } else {
            // Customer can only view their own projects
            return projectRepository.findByIdAndCustomerId(query.projectId(), query.requesterId())
                .orElseThrow(() -> new ProjectNotFoundException(query.projectId().value().toString()));
        }
    }
}
