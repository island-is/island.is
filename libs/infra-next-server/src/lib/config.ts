import { resolve } from 'path'
import { prepareConfig } from '@nrwl/next/src/utils/config'

export const workspaceRoot = resolve(__dirname, '../../../')

export const getNextConfig = (appDir: string, dev: boolean) => {
  const config = { dev }

  if (dev) {
    const options = {
      root: `${appDir}`,
      outputPath: `dist/${appDir}`,
      fileReplacements: [],
    }
    const context = {
      workspaceRoot,
    }

    // UPGRADE WARNING: Calling @nrwl/next internals. Be sure to test.
    // Only needs context.workspaceRoot in v10.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conf = prepareConfig(
      'phase-development-server',
      options,
      context as any,
    )
    Object.assign(config, { conf, dir: appDir })
  }
  return config
}
