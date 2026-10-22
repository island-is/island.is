# Upstream sync (`scripts/dmr/upstream-sync.sh`)

This fork is pruned to judicial-system. A full merge of `upstream/main` costs
~400 conflicts because upstream keeps editing libs/apps we deleted. This tool
syncs **only** the commits that touch paths the fork still keeps.
## Kept vs DMR-owned

Kept paths are computed dynamically each run: `apps/judicial-system`,
`apps/system-e2e`, every `libs/<project>` dir that still exists, `infra/`, and
shared root files (`package.json`, `yarn.lock`, `tsconfig*.json`, `nx.json`,
`.yarnrc.yml`, `.yarn/`, `scripts/ci/Dockerfile`, ...).
Always excluded: `terraform/`, `scripts/dmr/`, `docs/dmr/`, `.github/workflows/`.

## Report (default, read-only)

```bash
scripts/dmr/upstream-sync.sh            # since recorded base
scripts/dmr/upstream-sync.sh --base <sha>
```

Lists relevant upstream commits since the base, grouped judicial / shared-libs /
root, plus a count skipped because they touch only deleted paths. Commits that
import an `@island.is/<lib>` **not** in `tsconfig.base.json` are flagged `⚠` —
those libs are pruned here, so replaying them breaks the build.

## Apply

```bash
scripts/dmr/upstream-sync.sh --apply                 # new branch dmr/upstream-sync-<date>
scripts/dmr/upstream-sync.sh --apply --continue      # after resolving a conflict
```

Each commit is replayed via `git format-patch -1 <sha> -- <kept paths> | git am -3`,
so changes to deleted paths are dropped automatically and provenance is recorded
(`cherry picked from ...`). On a conflict it stops with resolve instructions;
fix, `git add`, re-run with `--continue`. If `package.json`/`yarn.lock` changed,
run `yarn install` to regenerate the lockfile before building.

The last synced upstream sha is stored in `scripts/dmr/.upstream-sync-base` and
updated after a successful apply.
