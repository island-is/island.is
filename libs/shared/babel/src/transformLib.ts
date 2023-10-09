import path from 'path'
import exportFinder from './exportFinder/exportFinder'
import memoize from 'lodash/memoize'
import { workspaceRoot } from '@nx/devkit'

const exportFinderCached = memoize(exportFinder)

const defaultMainPath = (libName: string) =>
  path.resolve(
    workspaceRoot,
    'libs',
    ...libName.replace('@island.is/', '').split('/'),
    'src',
    'index.ts',
  )

const transformLib = (
  libName: string,
  mainPath: string = defaultMainPath(libName),
) => ({
  [libName]: {
    transform: (importName: string) => {
      const exports = exportFinderCached(mainPath)
      if (exports[importName]) {
        return exports[importName]
      }

      // Other possible issues:
      // * wait a second, exports are cached for performance.
      // * when re-exporting, never rename stuff.
      //     export * as something from '...'
      //     export { default as Something, A as B } from '...'
      //   - instead export with the right name in the source file.
      throw new Error(
        `babel-transform-lib: Could not statically find ${importName} in ${libName}. Always use named exports. Renaming during re-export is not supported. Talk to the core team if you're stuck.`,
      )
    },
    preventFullImport: true,
    skipDefaultConversion: true,
  },
})

export default transformLib
