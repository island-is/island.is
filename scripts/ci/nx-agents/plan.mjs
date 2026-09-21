// @ts-check
/**
 * Plans a distributed (Nx Agents) CI run for a pull request.
 *
 * Decides the single Nx command the main job should run and how many agents to
 * start, based on the tasks in the run. All targets go in one command so Nx
 * computes the project graph once and schedules every task over the same agents.
 * Mirrors the label/env handling of `_nx-affected-targets.sh` and
 * `generate-chunks.sh` so both pipelines select the same projects.
 *
 * There are two types of agents (see `assignment-rules.yaml`): `judicial` agents only
 * run tasks of judicial projects, `shared` agents run everything else.
 *
 * A pull request that changes the CI configuration runs every task of every project, without
 * cache hits, to test the change. See `../ci-config-hash.mjs`.
 *
 * Usage: node scripts/ci/nx-agents/plan.mjs
 * Writes `agents`, `agent-count`, `nx-args`, `targets`, `unicorn-projects` and `ci-config-hash`
 * to $GITHUB_OUTPUT.
 */
import { execFileSync } from 'child_process'
import { appendFileSync, mkdtempSync, readFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { ciConfigHash } from '../ci-config-hash.mjs'

const env = process.env
const isTrue = (/** @type {string | undefined} */ v) => v === 'true'

const NX_PARALLEL = env.NX_PARALLEL || '3'

/**
 * `capacity` is the weighted task units (see TARGET_WEIGHTS) a single agent is expected to handle
 *
 * @typedef {'shared' | 'judicial'} AgentType
 * @type {Record<AgentType, { min: number, max: number, capacity: number, runner: string }>}
 */
const AGENT_TYPES = {
  shared: {
    min: parseInt(env.MIN_AGENTS || '1'),
    max: parseInt(env.MAX_AGENTS || '10'),
    capacity: parseInt(env.AGENT_CAPACITY || '60'),
    runner: env.SHARED_RUNNER || 'arc-shared',
  },
  judicial: {
    min: parseInt(env.MIN_JUDICIAL_AGENTS || '1'),
    max: parseInt(env.MAX_JUDICIAL_AGENTS || '2'),
    // Lower than for shared agents: `judicial-system-backend:test` takes over 10 minutes and
    // with a single agent every other judicial task shares that agent with it
    capacity: parseInt(env.JUDICIAL_AGENT_CAPACITY || '30'),
    runner: env.JUDICIAL_RUNNER || 'arc-shared',
  },
}
// Same projects as the `*judicial*` glob in `assignment-rules.yaml`
const JUDICIAL_PATTERN = /judicial/

// Rough relative cost of a task per target, used to size the agent pools.
// Targets that are only in the run as a dependency (codegen, ...) weigh 1
/** @type {Record<string, number>} */
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

const tmpFile = (/** @type {string} */ name) =>
  join(mkdtempSync(join(tmpdir(), 'nx-agents-')), name)

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
  const file = tmpFile('graph.json')
  nx(['graph', `--file=${file}`])
  const { graph } = JSON.parse(readFileSync(file, 'utf-8'))
  return Object.fromEntries(
    Object.entries(graph.nodes).map(([name, node]) => [
      name,
      Object.keys(node.data.targets ?? {}),
    ]),
  )
}

/**
 * Every task of the command, including the ones that are only in the run as a dependency
 * of another task. A task needs an agent of the right type or the run never finishes,
 * so the agent pools are sized from this and not from the list of selected projects.
 *
 * @param {string[]} nxArgs
 * @returns {{ project: string, target: string }[]}
 */
const getTasks = (nxArgs) => {
  if (nxArgs.length === 0) return []
  const file = tmpFile('tasks.json')
  nx([...nxArgs, `--graph=${file}`])
  const { tasks } = JSON.parse(readFileSync(file, 'utf-8'))
  return Object.values(tasks.tasks).map((task) => task.target)
}

/** @returns {string[]} projects that must have tests, see `check-unicorn-tests.sh` */
const getUnicornProjects = () =>
  JSON.parse(
    execFileSync(
      'node',
      ['scripts/ci/unicorn-utils.mjs', 'show-unicorns', '--json'],
      { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] },
    ),
  )

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
 * @param {AgentType} type
 * @param {number} units weighted task units
 * @returns {number}
 */
const agentCount = (type, units) =>
  units === 0
    ? 0
    : Math.min(
        AGENT_TYPES[type].max,
        Math.max(
          AGENT_TYPES[type].min,
          Math.ceil(units / AGENT_TYPES[type].capacity),
        ),
      )

const main = () => {
  // Has to be in the environment before Nx is asked for the tasks below, and the main job and
  // the agents get it from the output so all of them agree on the hashes of the tasks
  const configHash = ciConfigHash(env.NX_BASE ?? '', env.NX_HEAD ?? '')
  env.CI_CONFIG_HASH = configHash

  const projectTargets = getProjectTargets()
  const everything = isEverythingAffected() || configHash !== ''
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
  const withTarget = (/** @type {string} */ target) =>
    projects.filter((p) => projectTargets[p]?.includes(target))

  const skipWork = isTrue(env.SKIP_TESTS) || isTrue(env.DEPLOY_FEATURE)
  const targets = [
    'lint',
    'typecheck',
    ...(skipWork ? [] : ['build', 'test', 'e2e']),
  ].filter((target) => withTarget(target).length > 0)
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

  /** @type {Record<AgentType, { counts: Record<string, number>, units: number }>} */
  const load = {
    shared: { counts: {}, units: 0 },
    judicial: { counts: {}, units: 0 },
  }
  for (const { project, target } of getTasks(nxArgs)) {
    const pool = load[JUDICIAL_PATTERN.test(project) ? 'judicial' : 'shared']
    pool.counts[target] = (pool.counts[target] ?? 0) + 1
    pool.units += TARGET_WEIGHTS[target] ?? 1
  }

  // The `agents` job is a matrix of these. An agent only sets up what its tasks need
  const agents = /** @type {AgentType[]} */ (Object.keys(AGENT_TYPES)).flatMap(
    (type) =>
      Array.from({ length: agentCount(type, load[type].units) }, (_, i) => ({
        agent: `${type}-${i + 1}`,
        type,
        runner: AGENT_TYPES[type].runner,
        test: (load[type].counts.test ?? 0) > 0,
        e2e: (load[type].counts.e2e ?? 0) > 0,
      })),
  )
  const unicornProjects = targets.includes('test')
    ? getUnicornProjects().filter((p) => withTarget('test').includes(p))
    : []

  const outputs = {
    agents: JSON.stringify(agents),
    'agent-count': agents.length,
    'nx-args': JSON.stringify(nxArgs),
    targets: targets.join(','),
    'unicorn-projects': unicornProjects.join(','),
    'ci-config-hash': configHash,
  }
  console.log({ everything, debug, load, ...outputs })
  if (env.GITHUB_OUTPUT) {
    appendFileSync(
      env.GITHUB_OUTPUT,
      Object.entries(outputs)
        .map(([key, value]) => `${key}=${value}\n`)
        .join(''),
    )
  }
  if (env.GITHUB_STEP_SUMMARY) {
    const allTargets = [
      ...new Set([
        ...Object.keys(load.shared.counts),
        ...Object.keys(load.judicial.counts),
      ]),
    ].sort()
    const count = (/** @type {AgentType} */ type) =>
      agents.filter((agent) => agent.type === type).length
    appendFileSync(
      env.GITHUB_STEP_SUMMARY,
      [
        `### Nx Agents plan: ${count('shared')} shared and ${count(
          'judicial',
        )} judicial agent(s)`,
        '',
        ...(configHash === ''
          ? []
          : [
              `The CI configuration is changed (\`${configHash}\`): every task of every project runs, without cache hits.`,
              '',
            ]),
        '| Target | Shared tasks | Judicial tasks |',
        '| --- | --- | --- |',
        ...allTargets.map(
          (target) =>
            `| ${target} | ${load.shared.counts[target] ?? 0} | ${
              load.judicial.counts[target] ?? 0
            } |`,
        ),
        '',
        `Weighted task units: ${load.shared.units} shared (${AGENT_TYPES.shared.capacity} per agent), ${load.judicial.units} judicial (${AGENT_TYPES.judicial.capacity} per agent)`,
        '',
      ].join('\n'),
    )
  }
}

main()
