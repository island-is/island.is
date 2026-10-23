# DMR CI (GitHub-hosted runners)

The island.is workflows (ARC self-hosted runners, Helm, Nx Cloud, S3 buildkit
cache) were removed. Kept from island.is: `scripts/ci/Dockerfile` (driven by
`scripts/dmr/docker-build.sh`) and `scripts/ci/generate-files.mjs` (codegen +
tarball, used by `.github/actions/load-deps`).

## ci.yml

Same shape as island.is `push.yml`: one `prepare` job, then matrix legs.

```
prepare ─┬─ lint   (matrix: 7 services + system-e2e)
         ├─ test   (matrix: 7 services)
         ├─ build  (matrix: 7 services)
         └─ docker (matrix: web, api, backend)   push / dispatch only
                     └─ deploy (single job)      main / dispatch with deploy=true
```

- `prepare` installs and runs codegen once. node_modules is cached on
  `yarn.lock`; generated files are cached per commit (`generated-files-<sha>`).
  Every leg restores both, so codegen never runs twice for a commit.
- `docker` builds inside Docker, so it only restores the generated files.
- `deploy` is one job: all services share one Terraform state. It writes the
  new tag to SSM `/judicial-system/dev/<svc>/image-tag`, then `terraform apply`.
  Terraform reads the tag from SSM (`terraform/dev/image_tags.tf`), so a manual
  apply never rolls a service back. Runs in the GitHub `dev` environment — add
  required reviewers there to gate it.
- Service list comes from `scripts/dmr/docker-build-matrix.json`.

## terraform.yml

PR / push touching `terraform/`: fmt, validate, plan `terraform/dev` (no apply).

## AWS roles (OIDC, `DMR-is/island.is` only)

- ECR push: `arn:aws:iam::592944621100:role/shared-github-ci-role` (infra repo, `DMR-shared/_envcommon/github_oidc.hcl`)
- Judicial dev: `arn:aws:iam::640538430394:role/dev-judicial-system-github-ci-role` (`terraform/dev/github_oidc.tf`)

Terraform version is pinned in `terraform/.terraform-version` (tenv reads it too).

Not in CI yet: e2e, images for the 4 services with no ECR repo.
