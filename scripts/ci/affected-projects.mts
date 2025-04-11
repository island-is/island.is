import { execSync } from 'child_process'
import process from 'process'

// ======================== TYPES ========================
type ProjectInfo = {
  root: string
  targets: {
    build?: {
      options?: {
        outputPath?: string
      }
    }
  }
}

type DockerChunk = {
  projects: string
  docker_type: string
  home: string
  dist?: string
}

type Chunk = {
  projects: string[]
  docker_type: string
}

type AffectedOptions = {
  target: string
  base?: string
  head?: string
  skipJudicial?: boolean
  affectedAll?: boolean | string
  testEverything?: boolean
  skipTests?: boolean
  ciDebug?: boolean
  branch?: string
}

// ====================== CACHE ========================
const projectInfoCache = new Map<string, ProjectInfo>()

// ====================== CORE FUNCTIONS ========================
function getGitChangedFiles(): string[] {
  return execSync('git diff-tree --no-commit-id --name-only -r HEAD')
    .toString()
    .split('\n')
    .filter(Boolean)
}

function shouldTestEverything(options: AffectedOptions): boolean {
  return (
    options.testEverything ||
    getGitChangedFiles().includes('.github/actions/force-build.mjs') ||
    options.affectedAll === true ||
    (typeof options.affectedAll === 'string' &&
      options.affectedAll === `7913-${options.branch}`)
  )
}

function getProjectInfo(project: string): ProjectInfo {
  if (projectInfoCache.has(project)) {
    return projectInfoCache.get(project)!
  }

  const info = JSON.parse(
    execSync(`npx nx show project ${project} --json`).toString(),
  ) as ProjectInfo
  projectInfoCache.set(project, info)
  return info
}

// ====================== PUBLIC API ========================
export function getAffectedProjects(options: AffectedOptions): string[] {
  const {
    target,
    base = process.env.BASE || 'main',
    head = process.env.HEAD || 'HEAD',
    skipJudicial = process.env.SKIP_JUDICIAL === 'true',
    branch = process.env.BRANCH || process.env.GITHUB_HEAD_REF,
  } = options

  const extraArgs = shouldTestEverything(options)
    ? []
    : ['--affected', '--base', base, '--head', head]

  const projectsJson = execSync(
    `npx nx show projects --withTarget=${target} ${extraArgs.join(' ')} --json`,
  ).toString()

  let projects: string[] = JSON.parse(projectsJson)

  if (skipJudicial) {
    projects = projects.filter((project) => !project.startsWith('judicial-'))
  }

  return projects
}

export function generateChunks(
  projects: string[],
  options: { ciDebug?: boolean } = {},
): string[] {
  if (options.ciDebug && !process.env.TEST_EVERYTHING) {
    return [
      'web',
      'air-discount-scheme-api,air-discount-scheme-backend,air-discount-scheme-web',
      'license-api',
      'system-e2e',
      'island-ui-storybook',
    ]
  }

  const chunks = execSync(
    `node ${process.env.PROJECT_ROOT}/scripts/ci/_chunk.js "${projects.join(
      ', ',
    )}"`,
  ).toString()
  return JSON.parse(chunks)
}

export function getUnaffectedProjects(
  targets: string[],
  branch?: string,
): string[] {
  const unaffected: string[] = []

  for (const target of targets) {
    const affected = getAffectedProjects({ target, branch })
    const all = getAffectedProjects({
      target,
      affectedAll: `7913-${branch}`,
      branch,
    })

    const currentUnaffected = all.filter(
      (project) => !affected.includes(project),
    )
    unaffected.push(...currentUnaffected)
  }

  return [...new Set(unaffected)]
}

export function generateBuildChunks(
  targets: string[],
  options: Omit<AffectedOptions, 'target'> = {},
): Chunk[] {
  const {
    skipTests,
    branch = process.env.BRANCH || process.env.GITHUB_HEAD_REF,
  } = options

  if (skipTests || options.skipTestsOnBranch === `7913-${branch}`) {
    return []
  }

  return targets.flatMap((target) => {
    const projects = getAffectedProjects({ ...options, target, branch })
    if (projects.length === 0) return []

    return generateChunks(projects, options).map((projectList) => ({
      projects: projectList.split(',').map((p) => p.trim()),
      docker_type: target,
    }))
  })
}

export function generateDockerChunks(
  targets: string[],
  options: AffectedOptions & { maxJobs?: number } = {},
): DockerChunk[] {
  const { skipTests, maxJobs = 100, branch } = options

  if (skipTests) {
    return []
  }

  const chunks: DockerChunk[] = []
  const processedProjects = new Set<string>()

  for (const target of targets) {
    const projects = getAffectedProjects({ ...options, target, branch })

    for (const project of projects) {
      if (processedProjects.has(project)) continue
      processedProjects.add(project)

      try {
        const info = getProjectInfo(project)
        chunks.push({
          projects: project,
          docker_type: target,
          home: info.root,
          dist: info.targets?.build?.options?.outputPath,
        })
      } catch (error) {
        console.error(`Error processing project ${project}:`, error)
      }
    }
  }

  return chunks
}

// ====================== CLI INTERFACE ========================
if (import.meta.url.endsWith(process.argv[1])) {
  const command = process.argv[2]
  const args = process.argv.slice(3)

  const branch = process.env.BRANCH || process.env.GITHUB_HEAD_REF
  const baseOptions = {
    base: process.env.BASE,
    head: process.env.HEAD,
    skipJudicial: process.env.SKIP_JUDICIAL === 'true',
    affectedAll:
      process.env.AFFECTED_ALL === `7913-${branch}` ||
      process.env.NX_AFFECTED_ALL === 'true',
    testEverything: process.env.TEST_EVERYTHING === 'true',
    skipTests: process.env.SKIP_TESTS === 'true',
    skipTestsOnBranch: process.env.SKIP_TESTS_ON_BRANCH,
    branch,
    ciDebug: process.env.CI_DEBUG === 'true',
  }

  switch (command) {
    case 'affected':
      console.log(
        getAffectedProjects({ ...baseOptions, target: args[0] }).join(', '),
      )
      break

    case 'chunks':
      console.log(
        JSON.stringify(
          generateChunks(
            getAffectedProjects({ ...baseOptions, target: args[0] }),
            { ciDebug: baseOptions.ciDebug },
          ),
        ),
      )
      break

    case 'build-chunks':
      console.log(JSON.stringify(generateBuildChunks(args, baseOptions)))
      break

    case 'docker-chunks':
      console.log(
        JSON.stringify(
          generateDockerChunks(args, {
            ...baseOptions,
            maxJobs: parseInt(process.env.MAX_JOBS || '100', 10),
          }),
        ),
      )
      break

    case 'unaffected':
      console.log(getUnaffectedProjects(args, branch).join(' '))
      break

    default:
      console.error(`Unknown command: ${command}`)
      process.exit(1)
  }
}
