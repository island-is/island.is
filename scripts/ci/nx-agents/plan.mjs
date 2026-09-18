// @ts-check
/**
 * Plans a distributed (Nx Agents) CI run for a pull request.
 *
 * Decides the single Nx command the main job should run and how many agents to
 * start (MIN_AGENTS..MAX_AGENTS), based on the number of tasks in the run. All
 * targets go in one command so Nx computes the project graph once and schedules
 * every task over the same pool of agents.
 * Mirrors the label/env handling of `_nx-affected-targets.sh` and
 * `generate-chunks.sh` so both pipelines select the same projects.
 *
 * Usage: node scripts/ci/nx-agents/plan.mjs
 * Writes `agents`, `agent-count`, `nx-args`, `targets`, `has-test` and `has-e2e` to $GITHUB_OUTPUT.
 */
import { execFileSync } from 'child_process'
import { appendFileSync, mkdtempSync, readFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

const env = process.env
const isTrue = (/** @type {string | undefined} */ v) => v === 'true'

const MIN_AGENTS = parseInt(env.MIN_AGENTS || '1')
const MAX_AGENTS = parseInt(env.MAX_AGENTS || '10')
// Weighted task units a single agent is expected to handle
const AGENT_CAPACITY = parseInt(env.AGENT_CAPACITY || '60')
const NX_PARALLEL = env.NX_PARALLEL || '3'

// Rough relative cost of a task per target, used to size the agent pool
const TARGET_WEIGHTS = { lint: 1, typecheck: 2, test: 3, build: 4, e2e: 6 }
// Targets without a `ci` configuration fall back to their default one, so this only
// turns on `ci` and `codeCoverage` for the jest targets (see `targetDefaults` in nx.json).
// CLI args like `--coverage` are not an option since they would go to every target.
const CONFIGURATION = 'ci'
// Same projects as the `ci debug` branch of `generate-chunks.sh`
const CI_DEBUG_PROJECTS = [
  'web',
  'air-discount-scheme-api',
  'air-discount-scheme-backend',
  'air-discount-scheme-web',
  'license-api',
  'system-e2e',
  'island-ui-storybook',
]

/**
 * @param {string[]} args
 * @returns {string}
 */
const nx = (args) =>
  execFileSync('yarn', ['nx', ...args], {
    encoding: 'utf-8',
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'inherit'],
    env: { ...env, NX_DAEMON: 'false' },
  })

/** @returns {Record<string, string[]>} project name -> target names */
const getProjectTargets = () => {
  const file = join(mkdtempSync(join(tmpdir(), 'nx-agents-')), 'graph.json')
  nx(['graph', `--file=${file}`])
  const { graph } = JSON.parse(readFileSync(file, 'utf-8'))
  return Object.fromEntries(
    Object.entries(graph.nodes).map(([name, node]) => [
      name,
      Object.keys(node.data.targets ?? {}),
    ]),
  )
}

const isEverythingAffected = () => {
  const branch = env.BRANCH || env.GITHUB_HEAD_REF || ''
  const lastCommitFiles = execFileSync(
    'git',
    ['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'],
    { encoding: 'utf-8' },
  )
  return (
    (branch !== '' && env.AFFECTED_ALL === `7913-${branch}`) ||
    isTrue(env.NX_AFFECTED_ALL) ||
    isTrue(env.TEST_EVERYTHING) ||
    lastCommitFiles.includes('.github/actions/force-build.mjs')
  )
}

/**
 * @param {number} units weighted task units
 * @returns {number}
 */
const agentCount = (units) =>
  units === 0
    ? 0
    : Math.min(
        MAX_AGENTS,
        Math.max(MIN_AGENTS, Math.ceil(units / AGENT_CAPACITY)),
      )

const main = () => {
  const projectTargets = getProjectTargets()
  const everything = isEverythingAffected()
  const exclude = (env.GITHUB_BASE_REF || '').startsWith('release/')
    ? ['--exclude=judicial-*']
    : []

  // How the main job selects projects, and the projects that selection resolves to
  const range = [`--base=${env.NX_BASE}`, `--head=${env.NX_HEAD}`]
  const selector = everything
    ? ['run-many', ...exclude]
    : ['affected', ...range, ...exclude]
  /** @type {string[]} */
  const selected = JSON.parse(
    nx([
      'show',
      'projects',
      '--json',
      ...(everything ? [] : ['--affected', ...range]),
      ...exclude,
    ]),
  )

  // `ci debug` runs a fixed set of projects instead (for every target, to keep it a single command)
  const debug = isTrue(env.CI_DEBUG) && !isTrue(env.TEST_EVERYTHING)
  const debugProjects = CI_DEBUG_PROJECTS.filter((p) => p in projectTargets)
  const projects = debug ? debugProjects : selected

  const skipWork = isTrue(env.SKIP_TESTS) || isTrue(env.DEPLOY_FEATURE)
  /** @type {Record<string, number>} */
  const counts = {}
  const targets = [
    'lint',
    'typecheck',
    ...(skipWork ? [] : ['build', 'test', 'e2e']),
  ].filter((target) => {
    counts[target] = projects.filter((p) =>
      projectTargets[p]?.includes(target),
    ).length
    return counts[target] > 0
  })
  const nxArgs =
    targets.length === 0
      ? []
      : [
          ...(debug
            ? ['run-many', `--projects=${debugProjects.join(',')}`]
            : selector),
          `--targets=${targets.join(',')}`,
          `--configuration=${CONFIGURATION}`,
          `--parallel=${NX_PARALLEL}`,
        ]

  const units = Object.entries(counts).reduce(
    (sum, [target, count]) => sum + count * TARGET_WEIGHTS[target],
    0,
  )
  const agents = agentCount(units)

  const outputs = {
    agents: JSON.stringify(Array.from({ length: agents }, (_, i) => i + 1)),
    'agent-count': agents,
    'nx-args': JSON.stringify(nxArgs),
    targets: targets.join(','),
    'has-test': (counts.test ?? 0) > 0,
    'has-e2e': (counts.e2e ?? 0) > 0,
  }
  console.log({ everything, debug, counts, units, ...outputs })
  if (env.GITHUB_OUTPUT) {
    appendFileSync(
      env.GITHUB_OUTPUT,
      Object.entries(outputs)
        .map(([key, value]) => `${key}=${value}\n`)
        .join(''),
    )
  }
  if (env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      env.GITHUB_STEP_SUMMARY,
      [
        `### Nx Agents plan: ${agents} agent(s)`,
        '',
        '| Target | Projects |',
        '| --- | --- |',
        ...Object.entries(counts).map(
          ([target, count]) => `| ${target} | ${count} |`,
        ),
        '',
        `Weighted task units: ${units} (${AGENT_CAPACITY} per agent, ${MIN_AGENTS}-${MAX_AGENTS} agents)`,
        '',
      ].join('\n'),
    )
  }
}

main()
