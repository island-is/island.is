// UPGRADE WARNING:
// - Expects compatibility between @nx/node:webpack and @anatine/esbuildnx:build
// - Special logic around externalDependencies and option handling.
// - Modifying workspace object and running executor recursively.

import { runExecutor } from '@nx/devkit'
import type { ExecutorContext } from '@nx/devkit'
import { createTmpTsConfig } from './utils'

const EXTERNAL_DEPENDENCIES_DEFAULT_VALUE = 'all'

export interface BuildExecutorOptions {
  watch: boolean
  tsConfig: string
  externalDependencies?: string
}

/**
 * Runs webpack executor for local dev and esbuild executor for production builds.
 *
 * We do this because we need esbuildnx for production builds but its watch logic is broken and hurts DX.
 */
export default async function* buildExecutor(
  options: BuildExecutorOptions,
  context: ExecutorContext,
): AsyncIterableIterator<unknown> {
  const { projectName: project, targetName: target, workspace } = context
  const projectInfo = workspace?.projects[project!]
  const targets = projectInfo?.targets

  if (!project || !target || !projectInfo || !targets) {
    throw new Error('Missing project or target')
  }

  // Override the executor of the current task and re-run.
  // This was the only way to run different executors with the same options.
  if (!options.watch) {
    targets[target].executor = '@anatine/esbuildnx:build'
  } else {
    targets[target].executor = '@nx/webpack:webpack'
    targets[target].options.compiler = 'tsc'
    targets[target].options.target = 'node'

    // WARNING -- this is a doozy:
    // webpack5 + es modules + typescript metadata reflection + circular dependencies + barrel files = JS errors
    // NX recommends avoiding barrel files and circular dependencies for this reason, but this would be a big change
    // for many of our projects. They also configure tsConfig in node projects to emit commonjs modules, which works
    // better in this case. However, telling esbuild to emit commonjs modules triggers more CD errors :(
    // -- So we override tsConfig for webpack only.
    options.tsConfig = createTmpTsConfig(
      options.tsConfig,
      context.root,
      projectInfo.root,
    )
  }

  // This setting in the webpack executor supports an enum and an array. The default
  // value is "all", but `runExecutor` converts it into ["all"] which has different
  // behaviour. If we remove this default value, it gets reset in `runExecutor`.
  if (options.externalDependencies === EXTERNAL_DEPENDENCIES_DEFAULT_VALUE) {
    delete options.externalDependencies
  }

  // Inception!
  return yield* await runExecutor(
    { project, target, configuration: context.configurationName },
    options,
    context,
  )
}
