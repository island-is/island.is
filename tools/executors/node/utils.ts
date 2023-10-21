import { unlinkSync } from 'fs'
import { dirname, join, relative } from 'path'
import { writeJsonFile } from '@nx/devkit'

/**
 * This "hacky" code is copied and tweaked from @nx/workspace.
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
