import { existsSync, readFileSync } from 'fs'
import { dirname, join, relative, resolve } from 'path'
import { globSync } from 'glob'

type NxProject = {
  name?: unknown
  targets?: Record<string, unknown>
}

type IndexedProject = {
  file: string
  project: NxProject
}

const projectIndexCache = new Map<string, Map<string, IndexedProject[]>>()

const findWorkspaceRootFrom = (start: string): string | undefined => {
  let current = resolve(start)
  while (true) {
    if (existsSync(join(current, 'nx.json'))) return current
    const parent = dirname(current)
    if (parent === current) return undefined
    current = parent
  }
}

export const findRepositoryRoot = (): string => {
  const root =
    findWorkspaceRootFrom(process.cwd()) ?? findWorkspaceRootFrom(__dirname)
  if (!root) {
    throw new Error(
      'Unable to locate the Nx repository root for static service validation',
    )
  }
  return root
}

const getProjectIndex = (repositoryRoot: string) => {
  const root = resolve(repositoryRoot)
  const cached = projectIndexCache.get(root)
  if (cached) return cached

  const index = new Map<string, IndexedProject[]>()
  const files = globSync('{apps,libs}/**/project.json', {
    absolute: true,
    cwd: root,
    ignore: '**/node_modules/**',
  })

  for (const file of files) {
    let project: NxProject
    try {
      project = JSON.parse(readFileSync(file, 'utf8')) as NxProject
    } catch (error) {
      throw new Error(
        `Unable to read Nx project definition ${relative(root, file)}: ${String(
          error,
        )}`,
      )
    }
    if (typeof project.name !== 'string') continue
    const matches = index.get(project.name) ?? []
    matches.push({ file, project })
    index.set(project.name, matches)
  }

  projectIndexCache.set(root, index)
  return index
}

export const validateStaticServiceProject = (
  name: string,
  repositoryRoot = findRepositoryRoot(),
): void => {
  const matches = getProjectIndex(repositoryRoot).get(name) ?? []
  if (matches.length === 0) {
    throw new Error(
      `Static service "${name}" does not match any Nx project in apps/**/project.json or libs/**/project.json`,
    )
  }
  if (matches.length > 1) {
    const files = matches
      .map(({ file }) => relative(repositoryRoot, file))
      .sort()
      .join(', ')
    throw new Error(
      `Static service "${name}" matches multiple Nx projects: ${files}`,
    )
  }

  const [{ file, project }] = matches
  if (!project.targets || !('docker-static' in project.targets)) {
    throw new Error(
      `Static service "${name}" requires a docker-static target in ${relative(
        repositoryRoot,
        file,
      )}`,
    )
  }
}

export const clearStaticServiceProjectIndexCache = (): void => {
  projectIndexCache.clear()
}
