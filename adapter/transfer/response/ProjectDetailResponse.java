package com.tba.agentic.adapter.transfer.response;

import java.util.List;

public record ProjectDetailResponse(
    String projectId,
    String name,
    String productType,
    String description,
    String reference,
    String status,
    int revisionCount,
    List<MilestoneDto> milestones,
    String createdAt,
    String updatedAt,
    int version
) {
    public record MilestoneDto(
        Long milestoneId,
        String name,
        String status,
        int position
    ) {}
}
