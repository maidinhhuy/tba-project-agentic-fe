package com.tba.agentic.adapter.controller;

import com.tba.agentic.domain.Project;
import com.tba.agentic.domain.ProjectId;
import com.tba.agentic.domain.Role;
import com.tba.agentic.usecase.GetProjectDetailUseCase;
import com.tba.agentic.adapter.mapper.ProjectMapper;
import com.tba.agentic.adapter.transfer.response.ProjectDetailResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/projects")
public class AdminProjectController {

    private final GetProjectDetailUseCase getProjectDetailUseCase;
    private final ProjectMapper projectMapper;

    public AdminProjectController(GetProjectDetailUseCase getProjectDetailUseCase, ProjectMapper projectMapper) {
        this.getProjectDetailUseCase = getProjectDetailUseCase;
        this.projectMapper = projectMapper;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDetailResponse> getProjectDetail(@PathVariable UUID id) {
        // Admin gets any project — no customerId filter
        Project project = getProjectDetailUseCase.execute(new GetProjectDetailUseCase.Query(
            new ProjectId(id), null, Role.ADMIN));
        return ResponseEntity.ok(projectMapper.toDetailResponse(project));
    }
}
