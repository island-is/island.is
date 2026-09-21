// @ts-check
/**
 * Comments of the pull request pipeline. There is one comment per kind, which is
 * updated in place (found by a hidden marker) instead of adding a new one for every run.
 *
 * Usage: node scripts/ci/nx-agents/pr-comment.mjs <kind>
 *
 *   running  The checks of a commit have started
 *   result   The result of the checks. NEEDS: `toJSON(needs)` of the `success` job,
 *            JOB_STATUS: the status of the `success` job
 *   autofix  What the `autofix` job pushed. AUTOFIX_SHA: the commit,
 *            AUTOFIX_LINT_FILES/AUTOFIX_FORMAT_FILES: files with a changed file per line
 *
 * GH_TOKEN: token with `pull-requests: write`, PR_NUMBER, HEAD_SHA
 * Does nothing without a PR_NUMBER (e.g. `workflow_dispatch`). Set DRY_RUN=true to only print the comment.
 */
import { existsSync, readFileSync } from 'fs'

const env = process.env
const MAX_FILES = 30
const API = env.GITHUB_API_URL || 'https://api.github.com'
const RUN_URL = `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`
const sha = (/** @type {string | undefined} */ v) =>
  `\`${(v ?? '').slice(0, 10)}\``

/**
 * @param {string} path
 * @param {RequestInit} [init]
 */
const github = async (path, init) => {
  const response = await fetch(`${API}/repos/${env.GITHUB_REPOSITORY}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.GH_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  if (!response.ok) {
    throw new Error(
      `${init?.method ?? 'GET'} ${path}: ${
        response.status
      } ${await response.text()}`,
    )
  }
  return response.json()
}

/**
 * @param {string} marker
 * @param {string} body
 */
const upsertComment = async (marker, body) => {
  const tag = `<!-- ${marker} -->`
  const content = `${tag}\n${body}\n`
  if (env.DRY_RUN === 'true' || !env.PR_NUMBER) {
    console.log(content)
    return
  }
  let existing
  for (let page = 1; !existing; page++) {
    const comments = await github(
      `/issues/${env.PR_NUMBER}/comments?per_page=100&page=${page}`,
    )
    existing = comments.find((/** @type {{ body?: string }} */ comment) =>
      comment.body?.startsWith(tag),
    )
    if (comments.length < 100) break
  }
  await github(
    existing
      ? `/issues/comments/${existing.id}`
      : `/issues/${env.PR_NUMBER}/comments`,
    {
      method: existing ? 'PATCH' : 'POST',
      body: JSON.stringify({ body: content }),
    },
  )
  console.log(`${existing ? 'Updated' : 'Created'} the ${marker} comment`)
}

const running = () =>
  upsertComment(
    'ci-result',
    `### ⏳ Checks are running for ${sha(
      env.HEAD_SHA,
    )}\n\n[Workflow run](${RUN_URL})`,
  )

const result = () => {
  /** @type {Record<string, { result: string, outputs: Record<string, string> }>} */
  const needs = JSON.parse(env.NEEDS || '{}')
  const passed = env.JOB_STATUS === 'success'
  const icon = (/** @type {string} */ r) =>
    r === 'success' ? '✅' : r === 'skipped' ? '➖' : '❌'

  const { outputs = {} } = needs.main ?? {}
  /** @type {string[]} */
  const failedTasks = JSON.parse(outputs['failed-tasks'] || '[]')
  const failedChecks = (outputs['failed-checks'] || '')
    .split(' ')
    .filter(Boolean)

  return upsertComment(
    'ci-result',
    [
      `### ${passed ? '✅ Checks passed' : '❌ Checks failed'} for ${sha(
        env.HEAD_SHA,
      )}`,
      '',
      '| Job | Result |',
      '| --- | --- |',
      ...Object.entries(needs).map(
        ([job, { result }]) => `| ${job} | ${icon(result)} ${result} |`,
      ),
      '',
      ...(failedChecks.length > 0
        ? [
            `**Failed checks:** ${failedChecks
              .map((check) => `\`${check}\``)
              .join(', ')}. The Nx tasks were not run.`,
            '',
          ]
        : []),
      ...(failedTasks.length > 0
        ? [
            `**Failed Nx tasks (${failedTasks.length}):**`,
            '',
            ...failedTasks.map((task) => `- \`${task}\``),
            '',
          ]
        : []),
      [
        `[Workflow run](${RUN_URL})`,
        ...(outputs['nx-cloud-url']
          ? [`[Nx Cloud run](${outputs['nx-cloud-url']})`]
          : []),
      ].join(' · '),
    ].join('\n'),
  )
}

const autofix = () => {
  const files = (/** @type {string | undefined} */ path) =>
    path && existsSync(path)
      ? readFileSync(path, 'utf-8').split('\n').filter(Boolean)
      : []
  const section = (
    /** @type {string} */ title,
    /** @type {string[]} */ changed,
  ) =>
    changed.length === 0
      ? []
      : [
          `**${title} (${changed.length}):**`,
          '',
          ...changed.slice(0, MAX_FILES).map((file) => `- \`${file}\``),
          ...(changed.length > MAX_FILES
            ? [`- … and ${changed.length - MAX_FILES} more`]
            : []),
          '',
        ]

  return upsertComment(
    'ci-autofix',
    [
      `### 🔧 CI pushed ${sha(env.AUTOFIX_SHA)} to this branch`,
      '',
      'Pull before you continue working on it.',
      '',
      ...section('Lint fixes', files(env.AUTOFIX_LINT_FILES)),
      ...section('Formatting', files(env.AUTOFIX_FORMAT_FILES)),
      `[Workflow run](${RUN_URL})`,
    ].join('\n'),
  )
}

const kinds = { running, result, autofix }
const kind = kinds[/** @type {keyof typeof kinds} */ (process.argv[2])]
if (!kind) {
  console.error(`Usage: pr-comment.mjs <${Object.keys(kinds).join('|')}>`)
  process.exit(1)
}
await kind()
