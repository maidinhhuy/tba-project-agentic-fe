---
title: 'GitHub Action: Deploy Preview to Vercel on dev push'
type: chore
created: '2026-06-13'
status: done
route: one-shot
---

# GitHub Action: Deploy Preview to Vercel on dev push

## Intent

**Problem:** Không có CI/CD pipeline tự động — mỗi lần merge vào `dev` phải deploy thủ công lên Vercel.

**Approach:** Tạo GitHub Actions workflow trigger on `push` to `dev`, dùng Vercel CLI với 3 GitHub Secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`), deploy lên Vercel preview environment.

## Suggested Review Order

1. [`.github/workflows/deploy-preview.yml`](../.github/workflows/deploy-preview.yml) — workflow chính: trigger, permissions, steps theo thứ tự checkout → lint → vercel pull → build → deploy
