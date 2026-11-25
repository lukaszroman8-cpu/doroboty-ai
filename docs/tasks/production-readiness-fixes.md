# Production readiness fixes before a Vercel pilot

## Intent and acceptance

A production-readiness audit (docs/production-readiness.html) found blockers before publishing the prototype on Vercel for a small pilot (owner plus a few testers, synthetic data, low outage impact). Fix the ones that can be fixed locally:

1. Windows checkouts with `core.autocrlf=true` convert LF to CRLF, which makes `npm run format:check`, `design-system:check` and `verify:packet` fail falsely. Add `.gitattributes` that keeps LF in working trees; all three checks pass on Windows afterwards.
2. An unexpected render error currently leaves a blank page. Show a Polish fallback ("Coś poszło nie tak") with reload and a path to settings (export/reset), without logging private text or sending data anywhere.
3. Document publishing on Vercel: project import, Node version check, pre-release checks, a 5-minute post-release smoke check with a rollback condition, Instant Rollback and first incident steps.

Out of scope: deploying, Vercel account actions, installing Playwright Chromium, changing `engines`.

## Validation

Run the project gate steps available locally (format, design-system, lint, types, unit tests, packet, build). Browser journeys need a provisioned Playwright Chromium, which is not installed on this machine; report that instead of claiming them. Check the fallback manually in the browser. Update FEATURES.md for the new fallback behavior.
