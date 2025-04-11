import { execSync } from 'node:child_process'
import process from 'node:process'

import { ROOT } from './_common.mjs'

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

type BaseOptions = {
  base?: string
  head?: string
  skipJudicial?: boolean
  affectedAll?: boolean | string
  testEverything?: boolean
  skipTests?: boolean
  ciDebug?: boolean
  branch?: string
  skipTestsOnBranch?: string
}

type AffectedOptions = BaseOptions & {
  target: string
}

// ====================== CACHE ========================
const projectInfoCache = new Map<string, ProjectInfo>()

// ====================== CORE FUNCTIONS ========================
function getGitChangedFiles(): string[] {
  console.error('getGitChangedFiles...')
  return execSync('git diff-tree --no-commit-id --name-only -r HEAD')
    .toString()
    .split('\n')
    .filter(Boolean)
}

function shouldTestEverything(options: BaseOptions): boolean {
  console.error('shouldTestEverything...', { options })
  return (
    options.testEverything ||
    getGitChangedFiles().includes('.github/actions/force-build.mjs') ||
    options.affectedAll === true ||
    (typeof options.affectedAll === 'string' &&
      options.affectedAll === `7913-${options.branch}`)
  )
}

function getProjectInfo(project: string): ProjectInfo {
  console.error('getProjectInfo...', { project })
  const cachedInfo = projectInfoCache.get(project)
  if (cachedInfo) {
    return cachedInfo
  }

  const info = JSON.parse(
    execSync(`npx nx show project ${project} --json`).toString(),
  ) as ProjectInfo
  projectInfoCache.set(project, info)
  return info
}

// ====================== PUBLIC API ========================
export function getAffectedProjects(options: AffectedOptions): string[] {
  console.error('getAffectedProjects...', { options })
  const {
    target,
    base = options.branch ||
      process.env.BASE ||
      process.env.GITHUB_BASE_REF ||
      'main',
    head = process.env.HEAD || process.env.GITHUB_HEAD_REF || 'HEAD',
    skipJudicial = process.env.SKIP_JUDICIAL === 'true',
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
  console.error('generateChunks...', { projects, options })
  if (options.ciDebug && !process.env.TEST_EVERYTHING) {
    return [
      'web',
      'air-discount-scheme-api,air-discount-scheme-backend,air-discount-scheme-web',
      'license-api',
      'system-e2e',
      'island-ui-storybook',
    ]
  }

  console.error('Calling _chunk.js', { projects })
  const chunks = execSync(
    `node ${ROOT}/scripts/ci/_chunk.js "${projects.join(', ')}"`,
  ).toString()
  return JSON.parse(chunks)
}

export function getUnaffectedProjects(
  targets: string[],
  branch?: string,
): string[] {
  console.error('getUnaffectedProjects...', { targets, branch })
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
  options: BaseOptions = {},
): Chunk[] {
  console.error('generateBuildChunks...', { targets, options })
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
  options: BaseOptions = {},
): DockerChunk[] {
  console.error('generateDockerChunks...', { targets, options })
  const { skipTests, branch } = options

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
        console.error(`Error processing project ${project}:`, error, {
          error,
          target,
          project,
        })
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
  const baseOptions: BaseOptions = {
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
      process.stdout.write(
        getAffectedProjects({ ...baseOptions, target: args[0] }).join(', '),
      )
      break

    case 'chunks':
      process.stdout.write(
        JSON.stringify(
          generateChunks(
            getAffectedProjects({ ...baseOptions, target: args[0] }),
            { ciDebug: baseOptions.ciDebug },
          ),
        ),
      )
      break

    case 'build-chunks':
      process.stdout.write(
        JSON.stringify(generateBuildChunks(args, baseOptions)),
      )
      break

    case 'docker-chunks':
      process.stdout.write(
        JSON.stringify(
          generateDockerChunks(args, {
            ...baseOptions,
          }),
        ),
      )
      break

    case 'unaffected':
      process.stdout.write(getUnaffectedProjects(args, branch).join(' '))
      break

    case '-h':
    case '--help':
      console.error(
        [
          'affected [target]',
          'chunks [target]',
          'build-chunks [target]',
          'docker-chunks [target]',
          'unaffected [target]',
        ].join('\n'),
      )
      break

    default:
      console.error(`Unknown command: ${command}`)
      process.exit(1)
  }
}
