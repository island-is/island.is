export enum ApplicationSystemPaths {
  Root = '/umsoknakerfi',

  Overview = '/umsoknakerfi/yfirlit',
  Statistics = '/umsoknakerfi/tolfraedi',
  Translations = '/umsoknakerfi/thydingar',
  SharedNamespaceTranslationWorkspace = '/umsoknakerfi/thydingar/namespaces/:namespace',
  TranslationWorkspace = '/umsoknakerfi/thydingar/:typeId',
}

export const buildSharedNamespaceTranslationPath = (namespace: string) =>
  `${ApplicationSystemPaths.Translations}/namespaces/${encodeURIComponent(
    namespace,
  )}`

export const APPLICATION_SYSTEM_TAB_QUERY_PARAM = 'tab'
export const APPLICATION_SYSTEM_TRANSLATIONS_TAB_ID = 'translations'

export const buildTranslationsBackPath = () =>
  `${ApplicationSystemPaths.Root}?${APPLICATION_SYSTEM_TAB_QUERY_PARAM}=${APPLICATION_SYSTEM_TRANSLATIONS_TAB_ID}`
