package com.tba.agentic.adapter.controller;

import com.tba.agentic.adapter.transfer.request.SubmitProjectRequest;
import com.tba.agentic.adapter.transfer.response.ProjectDetailResponse;
import com.tba.agentic.domain.project.Milestone;
import com.tba.agentic.domain.project.ProjectId;
import com.tba.agentic.domain.project.ProductType;
import com.tba.agentic.domain.project.Project;
import com.tba.agentic.domain.user.Role;
import com.tba.agentic.domain.user.UserId;
import com.tba.agentic.port.in.GetCustomerProjectsUseCase;
import com.tba.agentic.port.in.GetProjectDetailUseCase;
import com.tba.agentic.port.in.SubmitProjectUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/customer/projects")
@RequiredArgsConstructor
public class CustomerProjectController {

    private final SubmitProjectUseCase submitProjectUseCase;
    private final GetCustomerProjectsUseCase getCustomerProjectsUseCase;
    private final GetProjectDetailUseCase getProjectDetailUseCase;
    private final SecurityContextHelper securityContextHelper;
    private final ProjectMapper projectMapper;

    @PostMapping
    public ResponseEntity<ProjectResponse> submitProject(
            @Valid @RequestBody SubmitProjectRequest request) {
        Long userId = securityContextHelper.getCurrentUserId();
        Project project = submitProjectUseCase.execute(new SubmitProjectUseCase.Command(
            new UserId(userId),
            request.name(),
            request.productType(),
            request.description(),
            request.reference()
        ));
        return ResponseEntity.status(201).body(projectMapper.toResponse(project));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getMyProjects() {
        Long userId = securityContextHelper.getCurrentUserId();
        List<Project> projects = getCustomerProjectsUseCase.execute(
            new GetCustomerProjectsUseCase.Query(new UserId(userId)));
        return ResponseEntity.ok(projects.stream().map(projectMapper::toResponse).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDetailResponse> getProjectDetail(@PathVariable UUID id) {
        Long userId = securityContextHelper.getCurrentUserId();
        Project project = getProjectDetailUseCase.execute(new GetProjectDetailUseCase.Query(
            new ProjectId(id), new UserId(userId), Role.CUSTOMER));
        return ResponseEntity.ok(projectMapper.toDetailResponse(project));
    }
}

@Component
class SecurityContextHelper {
    public Long getCurrentUserId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Long) {
            return (Long) authentication.getPrincipal();
        }
        throw new IllegalStateException("User not authenticated or principal is not of type Long");
    }
}

@Component
class ProjectMapper {
    public ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
            project.getProjectId().value().toString(),
            project.getName(),
            project.getProductType() != null ? project.getProductType().name() : null,
            project.getStatus().name(),
            project.getRevisionCount(),
            project.getMilestones().stream().map(this::toMilestoneDto).toList(),
            project.getVersion()
        );
    }

    public MilestoneDto toMilestoneDto(Milestone m) {
        return new MilestoneDto(
            m.getMilestoneId(),
            m.getName(),
            m.getStatus().name(),
            m.getPosition()
        );
    }

    public ProjectDetailResponse toDetailResponse(Project project) {
        return new ProjectDetailResponse(
            project.getProjectId().value().toString(),
            project.getName(),
            project.getProductType() != null ? project.getProductType().name() : null,
            project.getDescription(),
            project.getReference(),
            project.getStatus().name(),
            project.getRevisionCount(),
            project.getMilestones().stream().map(this::toDetailMilestoneDto).toList(),
            project.getCreatedAt() != null ? project.getCreatedAt().toString() : null,
            project.getUpdatedAt() != null ? project.getUpdatedAt().toString() : null,
            project.getVersion()
        );
    }

    private com.tba.agentic.adapter.transfer.response.ProjectDetailResponse.MilestoneDto toDetailMilestoneDto(Milestone m) {
        return new com.tba.agentic.adapter.transfer.response.ProjectDetailResponse.MilestoneDto(
            m.getMilestoneId(),
            m.getName(),
            m.getStatus().name(),
            m.getPosition()
        );
    }
}

record ProjectResponse(
    String projectId,
    String name,
    String productType,
    String status,
    int revisionCount,
    List<MilestoneDto> milestones,
    int version
) {}

record MilestoneDto(
    Long milestoneId,
    String name,
    String status,
    int position
) {}
