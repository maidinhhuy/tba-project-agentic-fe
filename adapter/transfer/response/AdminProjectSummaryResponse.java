package com.tba.agentic.adapter.transfer.response;

import java.util.List;
import java.util.Set;

public record AdminProjectSummaryResponse(
    String projectId,
    String customerName,
    String projectName,
    String status,
    String activeMilestoneName,
    String updatedAt
) {}

record AdminProjectDetailResponse(
    String projectId,
    Long customerId,
    String customerEmail,
    String name,
    String productType,
    String description,
    String reference,
    String status,
    Set<String> allowedNextStatuses,
    int revisionCount,
    List<MilestoneDto> milestones,
    String createdAt,
    String updatedAt,
    int version
) {}
