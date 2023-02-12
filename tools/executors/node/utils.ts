import { unlinkSync } from 'fs'
import { dirname, join, relative } from 'path'
import { writeJsonFile } from '@nrwl/devkit'
import { spawn, SpawnOptions } from 'child_process'

/**
 * This "hacky" code is copied and tweaked from @nrwl/workspace.
 * It allows us to override the tsconfig for webpack to have `"module": "commonjs",`.
 */
export function createTmpTsConfig(
  tsconfigPath: string,
  workspaceRoot: string,
  projectRoot: string,
) {
  const tmpTsConfigPath = join(
    workspaceRoot,
    'tmp',
    projectRoot,
    'tsconfig.commonjs.generated.json',
  )
  const parsedTSConfig = readTsConfigWithCommonJs(tsconfigPath, tmpTsConfigPath)
  process.on('exit', () => cleanupTmpTsConfigFile(tmpTsConfigPath))
  writeJsonFile(tmpTsConfigPath, parsedTSConfig)
  return join(tmpTsConfigPath)
}

function readTsConfigWithCommonJs(
  tsConfig: string,
  generatedTsConfigPath: string,
) {
  const generatedTsConfig: any = { compilerOptions: {} }
  generatedTsConfig.extends = relative(dirname(generatedTsConfigPath), tsConfig)
  generatedTsConfig.compilerOptions.module = 'commonjs'

  return generatedTsConfig
}

function cleanupTmpTsConfigFile(tmpTsConfigPath: string) {
  try {
    if (tmpTsConfigPath) {
      unlinkSync(tmpTsConfigPath)
    }
  } catch (e) {}
}

/**
 * Wraps child_process.spawn with more user friendly interface
 * and to be async using Promise.
 * @param {string} command
 * @param {SpawnOptions} options Same options as defined for `child_process.spawn()`
 * @returns Promise
 */
export function exec(
  command: string,
  options: SpawnOptions = {},
): Promise<void> {
  return new Promise((resolve, reject) => {
    const cmd = spawn(command, {
      stdio: 'inherit',
      shell: true,
      ...options,
    })

    cmd.on('exit', (exitCode) => {
      if (exitCode === 0) {
        resolve()
      } else {
        const error = new Error(
          `Command '${command}' exited with non-zero exit code ${exitCode}`,
        )
        reject(error)
      }
    })
  })
}
