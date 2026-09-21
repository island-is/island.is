// @ts-check
/**
 * Plans the Nx Agents that build the Docker images of the build and deploy pipeline.
 *
 * Every image is a `docker-build` task (see `tools/nx-plugins/docker-build.js`). The tasks are not
 * cached, so an agent runs one at a time. Same types of agents as the pull request pipeline, see
 * `assignment-rules.yaml`.
 *
 * BUILD_CHUNKS: the images to build, a JSON list of JSON strings from `generate-docker-chunks.sh`
 * Writes `agents`, `agent-count`, `nx-args` and `projects` to $GITHUB_OUTPUT.
 */
import { appendFileSync } from 'fs'

const env = process.env
const IMAGES_PER_AGENT = parseInt(env.IMAGES_PER_AGENT || '3')
// Same projects as the `*judicial*` glob in `assignment-rules.yaml`
const JUDICIAL_PATTERN = /judicial/
const AGENT_TYPES = {
  shared: {
    max: parseInt(env.MAX_AGENTS || '10'),
    runner: env.SHARED_RUNNER || 'arc-shared',
  },
  judicial: {
    max: parseInt(env.MAX_JUDICIAL_AGENTS || '2'),
    runner: env.JUDICIAL_RUNNER || 'arc-shared',
  },
}

/** @type {string[]} */
const projects = JSON.parse(env.BUILD_CHUNKS || '[]')
  .map((/** @type {string} */ chunk) => JSON.parse(chunk).projects)
  .sort()

const agents = Object.entries(AGENT_TYPES).flatMap(
  ([type, { max, runner }]) => {
    const images = projects.filter(
      (project) => JUDICIAL_PATTERN.test(project) === (type === 'judicial'),
    ).length
    const count = Math.min(max, Math.ceil(images / IMAGES_PER_AGENT))
    return Array.from({ length: count }, (_, i) => ({
      agent: `${type}-${i + 1}`,
      type,
      runner,
    }))
  },
)

const outputs = {
  agents: JSON.stringify(agents),
  'agent-count': agents.length,
  'nx-args': JSON.stringify(
    projects.length === 0
      ? []
      : [
          'run-many',
          '--targets=docker-build',
          `--projects=${projects.join(',')}`,
          // Not for `docker-build`, which has no configurations, but for the builds it depends on: Nx
          // passes the configuration of the command on to them. The Docker build does
          // `nx build <project> --prod`, and only the same tasks are cache hits in there
          '--configuration=production',
          // For the builds the images depend on, an agent builds one image at a time regardless
          `--parallel=${env.NX_PARALLEL || '3'}`,
        ],
  ),
  projects: projects.join(','),
}
console.log(outputs)
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
    `### Docker images: ${projects.length} on ${
      agents.length
    } Nx agent(s)\n\n${projects.map((project) => `- ${project}`).join('\n')}\n`,
  )
}
