const resolve = require('metro-resolver/src/resolve')
const { createMatchPath, loadConfig } = require('tsconfig-paths')
const { fileExistsSync } = require('tsconfig-paths/lib/filesystem')
const chalk = require('chalk')
const path = require('path')
const { createConsoleLogger } = require('configcat-js')
const { attempt } = require('lodash')
const DEBUG = false

/*
 * Use tsconfig to resolve additional workspace libs.
 *
 * This resolve function requires projectRoot to be set to
 * workspace root in order modules and assets to be registered and watched.
 */
function resolveRequest(_context, realModuleName, platform, moduleName) {
  if (DEBUG) {
    console.log(chalk.cyan(`[Nx] Resolving: ${moduleName}`))
  }
  const { resolveRequest, ...context } = _context
  try {
    return resolve(
      context,
      moduleName.replace(/\.js$/, ''),
      platform,
      moduleName,
    )
  } catch (_a) {
    if (DEBUG) {
      console.log(
        chalk.cyan(
          `[Nx] Unable to resolve with default Metro resolver: ${moduleName}`,
        ),
      )
    }
  }

  const matcher = getMatcher()
  const match = matcher(realModuleName)
  if (match) {
    return {
      type: 'sourceFile',
      filePath: match,
    }
  } else {
    if (DEBUG) {
      console.log(chalk.red(`[Nx] Failed to resolve ${chalk.bold(moduleName)}`))
      console.log(
        chalk.cyan(
          `[Nx] The following tsconfig paths was used:\n:${chalk.bold(
            JSON.stringify(paths, null, 2),
          )}`,
        ),
      )
    }

    const attemptedFilePath = path.join(
      path.dirname(context.originModulePath),
      realModuleName,
    )

    const extensions = ['.ts', '.tsx', '.js', 'jsx', '.json', '.png', '.jpg']
    try {
      extensions.forEach((extension) => {
        if (fileExistsSync(attemptedFilePath + extension)) {
          return { type: 'sourceFile', filePath: attemptedFilePath + extension }
        }
      })
    } catch (err) {
      if (DEBUG) {
        console.error('noop', attemptedFilePath);
      }
    }

    throw new Error(`Cannot resolve ${chalk.bold(moduleName)}`)
  }
}

exports.resolveRequest = resolveRequest

let matcher
let absoluteBaseUrl
let paths
function getMatcher() {
  if (!matcher) {
    const result = loadConfig()
    if (result.resultType === 'success') {
      absoluteBaseUrl = result.absoluteBaseUrl
      paths = result.paths
      if (DEBUG) {
        console.log(
          chalk.cyan(`[Nx] Located tsconfig at ${chalk.bold(absoluteBaseUrl)}`),
        )
        console.log(
          chalk.cyan(
            `[Nx] Found the following paths:\n:${chalk.bold(
              JSON.stringify(paths, null, 2),
            )}`,
          ),
        )
      }
      matcher = createMatchPath(absoluteBaseUrl, paths)
    } else {
      console.log(chalk.cyan(`[Nx] Failed to locate tsconfig}`))
      throw new Error(`Could not load tsconfig for project`)
    }
  }
  return matcher
}
