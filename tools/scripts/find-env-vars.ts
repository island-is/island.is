#!/usr/bin/env ts-node

import { readFileSync } from 'fs'
import { globSync } from 'glob'
import path from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import {
  createProjectGraphAsync,
  type ProjectGraph,
  type ProjectGraphProjectNode,
  workspaceRoot,
} from '@nx/devkit'

process.env.NX_DAEMON = process.env.NX_DAEMON ?? 'false'

type OutputFormat = 'json' | 'text'

const argv = yargs(hideBin(process.argv))
  .option('project', {
    alias: 'p',
    type: 'string',
    demandOption: true,
    describe: 'Nx project name to analyse',
  })
  .option('format', {
    alias: 'f',
    choices: ['json', 'text'] as const,
    default: 'json',
    describe: 'Output format',
  })
  .option('details', {
    alias: 'd',
    type: 'boolean',
    default: false,
    describe: 'Include file paths for each variable',
  })
  .option('include-tests', {
    type: 'boolean',
    default: false,
    describe: 'Scan spec/test/story files as well',
  })
  .option('ignore', {
    type: 'array',
    describe: 'Additional glob patterns to ignore',
    coerce: (value: unknown) =>
      Array.isArray(value) ? value.map(String) : [],
  })
  .help()
  .parseSync()

const OUTPUT_FORMAT = argv.format as OutputFormat
const INCLUDE_TESTS = argv['include-tests'] as boolean
const WITH_DETAILS = argv.details as boolean
const EXTRA_IGNORES = (argv.ignore as string[]) ?? []

type UsageMap = Map<string, Set<string>>

type Result = {
  project: string
  root: string
  required: UsageMap
  optional: UsageMap
  process: UsageMap
}

const REQUIRED_REGEX = /env(?:\?\.|\.)required(?:JSON)?\(\s*['"`]([^'"`]+)['"`]/g
const OPTIONAL_REGEX = /env(?:\?\.|\.)optional(?:JSON)?\(\s*['"`]([^'"`]+)['"`]/g
const PROCESS_DOT_REGEX = /process\.env(?:\?\.|\.)+([A-Za-z0-9_]+)/g
const PROCESS_BRACKET_REGEX = /process\.env(?:\?\.|\.)?\[\s*['"`]([^'"`]+)['"`]\s*\]/g

async function main() {
  const projectName = argv.project as string
  const graph = await createProjectGraphAsync()

  const targetNode = graph.nodes[projectName]
  if (!targetNode) {
    console.error(`Project "${projectName}" not found in workspace`)
    process.exit(1)
  }

  const relatedProjects = collectProjectTree(projectName, graph)
  const directoriesToScan = new Set(
    relatedProjects
      .map((proj) => proj.data.sourceRoot ?? proj.data.root)
      .filter((value): value is string => Boolean(value)),
  )

  const ignorePatterns = buildIgnorePatterns()

  const result: Result = {
    project: projectName,
    root: targetNode.data.sourceRoot ?? targetNode.data.root ?? projectName,
    required: new Map(),
    optional: new Map(),
    process: new Map(),
  }

  directoriesToScan.forEach((dir) => {
    const absRoot = path.join(workspaceRoot, dir)
    const files = globSync('**/*.{ts,tsx,js,jsx}', {
      cwd: absRoot,
      absolute: true,
      ignore: ignorePatterns,
    })

    files.forEach((file) => {
      const content = readFileSync(file, 'utf8')
      const relativePath = path.relative(workspaceRoot, file)

      collectMatches(content, REQUIRED_REGEX).forEach((name) =>
        addUsage(result.required, name, relativePath),
      )
      collectMatches(content, OPTIONAL_REGEX).forEach((name) =>
        addUsage(result.optional, name, relativePath),
      )
      collectMatches(content, PROCESS_DOT_REGEX).forEach((name) =>
        addUsage(result.process, name, relativePath),
      )
      collectMatches(content, PROCESS_BRACKET_REGEX).forEach((name) =>
        addUsage(result.process, name, relativePath),
      )
    })
  })

  result.required.forEach((_files, name) => {
    result.optional.delete(name)
    result.process.delete(name)
  })

  result.optional.forEach((_files, name) => {
    result.process.delete(name)
  })

  outputResult(result)
}

type ProjectInfo = {
  name: string
  data: ProjectGraphProjectNode['data']
}

function collectProjectTree(
  projectName: string,
  graph: ProjectGraph,
): ProjectInfo[] {
  const queue: string[] = [projectName]
  const visited = new Set<string>()
  const projects: ProjectInfo[] = []

  while (queue.length > 0) {
    const current = queue.shift()!
    if (visited.has(current)) {
      continue
    }
    visited.add(current)

    const node = graph.nodes[current]
    if (!node) {
      continue
    }

    projects.push({ name: current, data: node.data })

    const deps = graph.dependencies[current] ?? []
    deps.forEach((dep) => {
      if (dep.target.startsWith('npm:')) {
        return
      }
      queue.push(dep.target)
    })
  }

  return projects
}

function buildIgnorePatterns(): string[] {
  const patterns = [
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
    '**/.turbo/**',
    '**/.cache/**',
    '**/build/**',
    '**/*.d.ts',
  ]

  if (!INCLUDE_TESTS) {
    patterns.push(
      '**/*.spec.*',
      '**/*.test.*',
      '**/test/**',
      '**/__tests__/**',
      '**/*.stories.*',
      '**/.storybook/**',
    )
  }

  patterns.push(...EXTRA_IGNORES)
  return patterns
}

function collectMatches(content: string, pattern: RegExp): string[] {
  const matches: string[] = []
  const regex = new RegExp(pattern.source, pattern.flags.replace('g', '') + 'g')
  let match: RegExpExecArray | null

  while ((match = regex.exec(content))) {
    const [, name] = match
    if (name) {
      matches.push(name)
    }
  }

  return matches
}

function addUsage(map: UsageMap, name: string, file: string) {
  const entry = map.get(name) ?? new Set<string>()
  entry.add(file)
  map.set(name, entry)
}

function toOutputArray(map: UsageMap) {
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, files]) =>
      WITH_DETAILS
        ? {
            name,
            files: Array.from(files).sort(),
          }
        : name,
    )
}

function outputResult(result: Result) {
  const summary = {
    required: result.required.size,
    optional: result.optional.size,
    process: result.process.size,
  }

  if (OUTPUT_FORMAT === 'json') {
    const payload = {
      project: result.project,
      root: result.root,
      summary,
      required: toOutputArray(result.required),
      optional: toOutputArray(result.optional),
      process: toOutputArray(result.process),
    }
    process.stdout.write(JSON.stringify(payload, null, 2) + '\n')
    return
  }

  const lines: string[] = []
  lines.push(`Project: ${result.project}`)
  lines.push(`Root: ${result.root}`)
  lines.push('')

  lines.push(`Required (${summary.required}):`)
  lines.push(...formatList(result.required))
  lines.push('')

  lines.push(`Optional (${summary.optional}):`)
  lines.push(...formatList(result.optional))
  lines.push('')

  lines.push(`process.env references (${summary.process}):`)
  lines.push(...formatList(result.process))

  process.stdout.write(lines.join('\n') + '\n')
}

function formatList(map: UsageMap): string[] {
  if (map.size === 0) {
    return ['  (none)']
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([name, files]) => {
      if (!WITH_DETAILS) {
        return [`  - ${name}`]
      }
      const header = `  - ${name}`
      const fileLines = Array.from(files)
        .sort()
        .map((file) => `      • ${file}`)
      return [header, ...fileLines]
    })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
