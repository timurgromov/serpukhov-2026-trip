# Static deployment handoff

## Deploy standard 1.0.0

This project adapts `Tamplates/DEPLOY_TEMPLATE.md@1.0.0` to its existing GitHub Pages workflow. Every artifact includes `deploy-version.json` with the exact source SHA. The deploy job checks that passport and the homepage before reporting success. GitHub Actions serializes publication and records upload, build, checks and total durations. Rollback reruns the previously verified source commit through the same workflow. Compare timings only for the same source/artifact scope and check coverage.
