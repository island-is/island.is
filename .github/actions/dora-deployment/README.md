# DORA Deployment Action

Composite GitHub Action for DORA metrics and service catalog management.

## DORA Deployment Events (`main.mjs`)

Reports deployment events to Datadog DORA Metrics. Two modes:

### mode=start

Captures a timestamp at the beginning of the deploy process.

```yaml
- uses: ./.github/actions/dora-deployment
  id: dora-start
  with:
    mode: start
```

### mode=finish

Sends deployment events to Datadog for each deployed service.

```yaml
- uses: ./.github/actions/dora-deployment
  with:
    mode: finish
    dd-api-key: ${{ secrets.DD_API_KEY }}
    environment: prod
    started-at: ${{ steps.dora-start.outputs.started-at }}
```

Services are resolved from either:
- `services` input (comma-separated)
- `data-file` input (JSON with `.project` fields, defaults to `/tmp/data.json`)

### What this gives you

- **Deployment Frequency** — counted per service per environment
- **Lead Time for Changes** — calculated by Datadog from commit SHA to deployment time (requires GitHub integration connected in Datadog)

Change Failure Rate and MTTR require a separate incident source configured in Datadog DORA settings.

---

## CODEOWNERS → Datadog Service Catalog Sync (`sync-codeowners.mjs`)

Automatically maps service ownership from GitHub CODEOWNERS to Datadog's Service Catalog.

### How it works

1. Discovers all deployable apps (directories with `project.json` containing a docker target)
2. Resolves team ownership by matching each app's path against CODEOWNERS rules (last-match-wins, same as GitHub)
3. Falls back to `core` team for unmatched services
4. Upserts service definitions via the Datadog Service Definition API (v2.2 schema)

### Workflow

Defined in `.github/workflows/sync-codeowners.yml`. Triggers:
- Push to `main` that changes `.github/CODEOWNERS`
- `workflow_dispatch` for manual backfill

### Requirements

- `DD_API_KEY` secret
- `DD_APP_KEY_DORA` secret (Application Key with `apm_service_catalog_write` scope)

### Manual run

```bash
DD_API_KEY=<key> DD_APP_KEY=<app-key> DD_SITE=datadoghq.eu node .github/actions/dora-deployment/sync-codeowners.mjs
```

Dry run (logs what it would do without calling the API):

```bash
DRY_RUN=true DD_API_KEY=x DD_APP_KEY=x node .github/actions/dora-deployment/sync-codeowners.mjs
```

### Multiple team ownership

The Datadog v2.2 schema supports a single `team` field. When CODEOWNERS assigns multiple teams to a service, the last team is set as primary owner and additional teams are added as contacts.

### External services (other repos)

Services not in this monorepo (e.g. identity-server, DSS) need to be registered separately — either via the API directly or by adding an `external-services.json` override file (not yet implemented).

---

## Running tests

```bash
cd .github/actions/dora-deployment
NODE_OPTIONS="--experimental-vm-modules" npx jest --config jest.config.mjs
```
