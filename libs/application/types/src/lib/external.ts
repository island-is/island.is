import { StaticTextObject } from './Form'

// Copied here to reduce the dependency graph. Instead of exporting this outside the workspace, you should
// import { FormatMessage } from '@island.is/localization' or '@island.is/cms-translations'
export type FormatMessage = (
  descriptor: StaticTextObject,
  values?: Record<string, any>,
) => string
