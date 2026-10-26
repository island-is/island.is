// @ts-check

// Publish the CI-computed affected-apps set to path-to-deployment's ingest
// endpoint (spec affected-apps-ci-publish, OD-1 option B), so its image-tag
// resolution for this PR becomes a single DynamoDB lookup instead of an ECR
// registry sweep.
//
// BEST-EFFORT by contract: every failure path logs a warning and returns
// without throwing, so this can NEVER fail the deploy-feature pipeline. The
// workflow step is additionally guarded `continue-on-error: true`.
//
// Reads /tmp/data.json (written by write-data.mjs) for the per-app
// {imageName, imageTag} records, mints a GitHub OIDC token for the configured
// audience, and POSTs the record to the ingest endpoint.

import fs from 'fs'
import path from 'path'
// @ts-ignore
import core from '@actions/core'
import { isMainModule } from './utils.mjs'

const SCHEMA_VERSION = 1
const DATA_FILE = path.join('/tmp', 'data.json')
const DEFAULT_TTL_DAYS = 30

/** Map /tmp/data.json rows -> the record's apps[] ({name, imageTag}). */
export function buildApps(rows) {
  if (!Array.isArray(rows)) {
    return []
  }
  return rows
    .filter((r) => r && r.imageName && r.imageTag)
    .map((r) => ({ name: String(r.imageName), imageTag: String(r.imageTag) }))
}

/**
 * Build the versioned ingest record. `now` is injectable so the ttl is
 * deterministic in tests.
 */
export function buildRecord(
  { repository, sha, branch, rows, ttlDays = DEFAULT_TTL_DAYS },
  now = Math.floor(Date.now() / 1000),
) {
  const record = {
    repository,
    sha,
    apps: buildApps(rows),
    version: SCHEMA_VERSION,
    // ttl is epoch SECONDS; the writer owns the policy (OD-4, 30 days default).
    ttl: now + ttlDays * 24 * 60 * 60,
  }
  if (branch) {
    record.branch = branch
  }
  return record
}

export async function main() {
  const endpoint = process.env.AFFECTED_APPS_INGEST_URL
  const audience = process.env.AFFECTED_APPS_OIDC_AUDIENCE
  const repository = process.env.GITHUB_REPOSITORY
  const sha = process.env.PR_HEAD_SHA
  const branch = process.env.GIT_BRANCH_DEPLOY
  const ttlDays = Number(
    process.env.AFFECTED_APPS_TTL_DAYS || String(DEFAULT_TTL_DAYS),
  )

  // Rollout gate: unset endpoint/audience => no-op (the step is enabled by
  // setting the two repo variables, one workflow/env at a time).
  if (!endpoint || !audience) {
    core.info(
      'publish-affected: AFFECTED_APPS_INGEST_URL/AUDIENCE unset — skipping (rollout gate).',
    )
    return
  }
  if (!repository || !sha) {
    core.warning(
      'publish-affected: missing GITHUB_REPOSITORY or PR_HEAD_SHA — skipping.',
    )
    return
  }

  let rows
  try {
    rows = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  } catch (err) {
    core.warning(
      `publish-affected: cannot read ${DATA_FILE} — skipping. ${err}`,
    )
    return
  }

  const record = buildRecord({ repository, sha, branch, rows, ttlDays })
  if (record.apps.length === 0) {
    core.info('publish-affected: no apps in data.json — skipping.')
    return
  }

  let token
  try {
    // Mint an OIDC token scoped to OUR audience (not sts.amazonaws.com).
    token = await core.getIDToken(audience)
  } catch (err) {
    core.warning(
      `publish-affected: could not mint OIDC token — skipping. ${err}`,
    )
    return
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(record),
    })
    if (!res.ok) {
      core.warning(
        `publish-affected: ingest returned ${res.status} — ignored (best-effort).`,
      )
      return
    }
    core.info(
      `publish-affected: published ${
        record.apps.length
      } apps for ${repository}@${sha.slice(0, 10)}.`,
    )
  } catch (err) {
    core.warning(
      `publish-affected: POST failed — ignored (best-effort). ${err}`,
    )
  }
}

if (isMainModule(import.meta.url)) {
  // Never throw out of the process — best-effort by contract.
  main().catch((err) =>
    core.warning(`publish-affected: unexpected error — ignored. ${err}`),
  )
}
