import ChildrenResidenceChangeTemplate from './lib/ChildrenResidenceChangeTemplate'

export const getDataProviders = () => import('./dataProviders/')

export const getFields = () => import('./fields/')

export const getTranslationWorkspacePreviewApplication = () =>
  import('./lib/translationWorkspacePreview').then(
    (module) => module.translationWorkspacePreviewApplication,
  )

export * from './types'

export * from './lib/messages'

export default ChildrenResidenceChangeTemplate
