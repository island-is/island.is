import { prepareConfig } from '@nrwl/next/src/utils/config'

export const getNextConfig = (appDir: string, dev: boolean) => {
  const config = { dev }

  if (dev || process.env.API_MOCKS) {
    const options = {
      root: `${appDir}`,
      outputPath: `dist/${appDir}`,
      fileReplacements: [],
    }
    const context = {
      root: process.cwd(),
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
