import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import {
  clearStaticServiceProjectIndexCache,
  validateStaticServiceProject,
} from './static-service-project'

describe('static service Nx project validation', () => {
  let repositoryRoot: string

  const addProject = (
    directory: string,
    name: string,
    targets: Record<string, unknown> = {},
  ) => {
    const projectDirectory = join(repositoryRoot, 'apps', directory)
    mkdirSync(projectDirectory, { recursive: true })
    writeFileSync(
      join(projectDirectory, 'project.json'),
      JSON.stringify({ name, targets }),
    )
  }

  beforeEach(() => {
    repositoryRoot = mkdtempSync(join(tmpdir(), 'static-service-project-'))
    writeFileSync(join(repositoryRoot, 'nx.json'), '{}')
    clearStaticServiceProjectIndexCache()
  })

  afterEach(() => {
    clearStaticServiceProjectIndexCache()
    rmSync(repositoryRoot, { recursive: true, force: true })
  })

  it('accepts exactly one project with a docker-static target', () => {
    addProject('static-app', 'static-app', { 'docker-static': {} })
    expect(() =>
      validateStaticServiceProject('static-app', repositoryRoot),
    ).not.toThrow()
  })

  it('rejects an unknown project', () => {
    expect(() =>
      validateStaticServiceProject('unknown', repositoryRoot),
    ).toThrow(/does not match any Nx project/)
  })

  it('rejects duplicate project names', () => {
    addProject('first', 'duplicate', { 'docker-static': {} })
    addProject('second', 'duplicate', { 'docker-static': {} })
    expect(() =>
      validateStaticServiceProject('duplicate', repositoryRoot),
    ).toThrow(/matches multiple Nx projects.*apps\/first.*apps\/second/)
  })

  it('rejects a project without the docker-static target', () => {
    addProject('api', 'api', { docker: {} })
    expect(() => validateStaticServiceProject('api', repositoryRoot)).toThrow(
      /requires a docker-static target.*apps\/api\/project.json/,
    )
  })
})
