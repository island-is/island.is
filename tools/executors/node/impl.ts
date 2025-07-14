// UPGRADE WARNING:
// - Updated to use @nx/esbuild:esbuild instead of @anatine/esbuildnx:build for Nx 21 compatibility
// - Removed deprecated workspace modification approach
// - Using proper Nx 21 project graph API

import { runExecutor } from '@nx/devkit'
import type { ExecutorContext } from '@nx/devkit'
import { createTmpTsConfig } from './utils'

const EXTERNAL_DEPENDENCIES_DEFAULT_VALUE = 'all'

export interface BuildExecutorOptions {
  watch?: boolean
  tsConfig: string
  externalDependencies?: string | string[]
  main: string
  outputPath: string
  sourceMap?: boolean
  progress?: boolean
  assets?: any[]
  statsJson?: boolean
  verbose?: boolean
  extractLicenses?: boolean
  optimization?: boolean
  maxWorkers?: number
  memoryLimit?: number
  fileReplacements?: Array<{ replace: string; with: string }>
  webpackConfig?: string | string[]
  buildLibsFromSource?: boolean
  generatePackageJson?: boolean
  transformers?: any[]
  additionalEntryPoints?: Array<{ entryName: string; entryPath: string }>
  outputFileName?: string
  poll?: number
  showCircularDependencies?: boolean
  external?: string[]
}

/**
 * Runs webpack executor for local dev and esbuild executor for production builds.
 *
 * We do this because we need esbuild for production builds but its watch logic is broken and hurts DX.
 */
export default async function* buildExecutor(
  options: BuildExecutorOptions,
  context: ExecutorContext,
): AsyncIterableIterator<unknown> {
  const { projectName: project, targetName: target } = context

  if (!project || !target) {
    throw new Error('Missing project or target')
  }

  // Get project info from the project graph
  const projectGraph = context.projectGraph
  const projectInfo = projectGraph?.nodes[project]

  if (!projectInfo) {
    throw new Error(`Project ${project} not found in project graph`)
  }

  // Handle externalDependencies default value issue
  // This setting in the webpack executor supports an enum and an array. The default
  // value is "all", but `runExecutor` converts it into ["all"] which has different
  // behaviour. If we remove this default value, it gets reset in `runExecutor`.
  const executorOptions = { ...options }
  if (
    executorOptions.externalDependencies === EXTERNAL_DEPENDENCIES_DEFAULT_VALUE
  ) {
    delete executorOptions.externalDependencies
  }

  if (!options.watch) {
    // Production build with esbuild
    const esbuildOptions = {
      ...executorOptions,
      main: options.main,
      outputPath: options.outputPath,
      tsConfig: options.tsConfig,
      sourceMap: options.sourceMap ?? true,
      optimization: options.optimization ?? false,
      generatePackageJson: options.generatePackageJson ?? false,
      assets: options.assets ?? [],
      fileReplacements: options.fileReplacements ?? [],
      buildLibsFromSource: options.buildLibsFromSource ?? true,
      showCircularDependencies: options.showCircularDependencies ?? false,
      external: options.external ?? [],
      format: ['cjs'], // Add format option for Node.js applications
    }

    // Call esbuild executor directly
    const esbuildExecutor =
      require('@nx/esbuild/src/executors/esbuild/esbuild.impl').default
    const result = esbuildExecutor(esbuildOptions, context)
    for await (const output of result) {
      yield output
    }
  } else {
    // Development build with webpack
    const tmpTsConfig = createTmpTsConfig(
      options.tsConfig,
      context.root,
      projectInfo.data.root,
    )

    const webpackOptions = {
      ...executorOptions,
      main: options.main,
      outputPath: options.outputPath,
      tsConfig: tmpTsConfig,
      compiler: 'tsc',
      target: 'node',
      sourceMap: options.sourceMap ?? true,
      progress: options.progress ?? false,
      statsJson: options.statsJson ?? false,
      verbose: options.verbose ?? false,
      extractLicenses: options.extractLicenses ?? false,
      optimization: options.optimization ?? false,
      maxWorkers: options.maxWorkers,
      memoryLimit: options.memoryLimit ?? 8192,
      assets: options.assets ?? [],
      fileReplacements: options.fileReplacements ?? [],
      webpackConfig:
        options.webpackConfig ?? './tools/executors/node/webpack.config.js',
      buildLibsFromSource: options.buildLibsFromSource ?? true,
      generatePackageJson: options.generatePackageJson ?? false,
      transformers: options.transformers ?? [],
      additionalEntryPoints: options.additionalEntryPoints ?? [],
      outputFileName: options.outputFileName ?? 'main.js',
      poll: options.poll,
      showCircularDependencies: options.showCircularDependencies ?? false,
    }

    // Call webpack executor directly
    const webpackExecutor =
      require('@nx/webpack/src/executors/webpack/webpack.impl').default
    const result = webpackExecutor(webpackOptions, context)
    for await (const output of result) {
      yield output
    }
  }
}
