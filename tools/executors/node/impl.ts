// UPGRADE WARNING:
// - Expects compatibility between @nrwl/node:webpack and @anatine/esbuildnx:build
// - Special logic around externalDependencies and option handling.
// - Modifying workspace object and running executor recursively.

import { runExecutor } from '@nrwl/devkit'
import type { ExecutorContext } from '@nrwl/devkit';

const EXTERNAL_DEPENDENCIES_DEFAULT_VALUE = 'all'

export interface BuildExecutorOptions {
  watch: boolean;
  externalDependencies?: string;
}

/**
 * Runs webpack executor for local dev and esbuild executor for production builds.
 *
 * We do this because we need esbuildnx for production builds but its watch logic is broken and hurts DX.
 */
export default async function* buildExecutor(
  options: BuildExecutorOptions,
  context: ExecutorContext
): AsyncIterableIterator<unknown> {
  const { projectName: project, targetName: target, workspace } = context
  const targets = workspace.projects[project!]?.targets

  if (!project || !target || !targets) {
    throw new Error('Missing project or target')
  }

  // Override the executor of the current task and re-run.
  // This was the only way to run another executor with the same options.
  if (options.watch) {
    targets[target].executor = '@nrwl/node:webpack'
  } else {
    targets[target].executor = '@anatine/esbuildnx:build'
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
    context
  );
}
