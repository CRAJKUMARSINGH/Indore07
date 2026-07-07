## Summary

<!-- Describe what this PR does in 2–3 sentences. What problem does it solve? -->

## Type of Change

- [ ] Bug fix (non-breaking)
- [ ] New feature (non-breaking)
- [ ] Breaking change (requires migration or consumer update)
- [ ] Content addition (new lessons/exercises)
- [ ] Documentation / chore

## Related Issue

Closes #

## Changes Made

<!-- List the key files changed and why. Bullet points are fine. -->

-
-
-

## Screenshots or Demo

<!-- If this is a frontend change, attach a screenshot or screen recording. -->

## OpenAPI / Codegen

- [ ] I changed `lib/api-spec/openapi.yaml`
- [ ] I ran `pnpm --filter @workspace/api-spec run codegen` and committed the generated files

## Database

- [ ] I changed `lib/db/src/schema/`
- [ ] I ran `pnpm --filter @workspace/db run push` (dev only — do not run against prod)

## Checklist

- [ ] `pnpm run typecheck` passes with no errors
- [ ] `pnpm --filter @workspace/api-server run build` succeeds
- [ ] All edge cases (empty state, error state, loading state) are handled in the UI
- [ ] Server route handlers use `req.log`, not `console.log`
- [ ] No secrets or credentials committed
- [ ] PR title follows Conventional Commits format (`feat(scope): ...`)
