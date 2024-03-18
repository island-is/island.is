import { exec as _exec } from 'child_process'
import {
  cp,
  mkdir,
  readFile,
  writeFile,
} from 'fs/promises'
import { glob } from 'glob'
import { resolve } from 'path'
import { promisify } from 'util'

import {
  type ProjectGraphExternalNode,
  type ExecutorContext,
} from '@nx/devkit'
import { getExtraDependencies } from '@nx/esbuild/src/executors/esbuild/lib/get-extra-dependencies'

type DependentBuildableProjectNode = ReturnType<
  typeof getExtraDependencies
>[number] & {
  node: ProjectGraphExternalNode
}

export interface BuildExecutorOptions {
  appRoot: string
  distRoot: string
  sourceRoot: string
  tsConfig: string
}

const exec = promisify(_exec)

/**
 * Asynchronously builds e2e tests, generates package.json, and lock file.
 *
 * @param options - Configuration options for the build executor.
 * @param context - The execution context, including project and graph information.
 * @returns An async iterable iterator indicating the progress and success of the build process.
 */
export default async function* buildExecutor(
  options: BuildExecutorOptions,
  context: ExecutorContext,
): AsyncIterableIterator<unknown> {
  const { distRoot, sourceRoot, tsConfig } = options
  const { projectName, projectGraph } = context


  // Retrieve external dependencies from the project graph
  const nodeDeps = getExtraDependencies(projectName!, projectGraph!).filter(
    (e) => e.node.type === 'npm',
  ) as DependentBuildableProjectNode[]

  // Construct a dependencies object for packagejson
  const depsObj = nodeDeps.reduce<Record<string, string>>(
    (acc, dep) => ({
      ...acc,
      [dep.node.data.packageName]: dep.node.data.version,
    }),
    {},
  )

  // Prepare external dependencies for esbuild
  const externalDeps = Object.keys(depsObj).map((pkg) => `--external:${pkg}`)

  // Glob pattern for entry points
  const pattern = `${sourceRoot}/**/*.ts`
  const optionsForGlob = { ignore: ['**/node_modules/**', '**/*.d.ts'] }
  const entryPoints = await glob(pattern, optionsForGlob)

  // Bundle with esbuild
  await exec(
    [
      'yarn',
      'esbuild',
      '--bundle',
      ...entryPoints,
      `--tsconfig=${tsConfig}`,
      `--outdir=${distRoot}`,
      '--platform=node',
      ...externalDeps,
    ].join(' '),
    {
      encoding: 'utf-8',
    },
  )

  // Read and use the base package.json to maintain consistency
  const rootPackageJson = JSON.parse(await readFile('package.json', 'utf-8'))
  const packageManager = rootPackageJson.packageManager as string
  const resolutions = rootPackageJson.resolutions
  // Generate package.json for the dist
  const pkgJson = {
    name: projectName,
    version: "1.0.0",
    dependencies: depsObj,
    packageManager,
    resolutions,
  }
  const packageJSONPath = resolve(distRoot, 'package.json')
  await writeFile(packageJSONPath, JSON.stringify(pkgJson, null, 2))

  // Copy the yarn lock file
  const yarnLockPath = resolve(distRoot, 'yarn.lock')
  await writeFile(yarnLockPath, await readFile('yarn.lock', 'utf-8'))

  const newYarnPatches = resolve(distRoot, '.yarn', 'patches')
  const oldYarnPatches = resolve(process.cwd(), '.yarn', 'patches')

  // Create patch directory
  await mkdir(newYarnPatches, { recursive: true })

  // Copy patches
  await cp(oldYarnPatches, newYarnPatches, { recursive: true })

  // Update the lock file in the dist directory
  const distDir = resolve(process.cwd(), distRoot)
  await exec(['yarn', '--mode=update-lockfile'].join(' '), {
    encoding: 'utf-8',
    env: {
      ...process.env,
      YARN_ENABLE_IMMUTABLE_INSTALLS: 'false',
    },
    cwd: distDir,
  })

  return {
    success: true,
  }
}
