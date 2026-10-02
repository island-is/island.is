export enum ApplicationSystemPaths {
  Root = '/umsoknakerfi',

  Overview = '/umsoknakerfi/yfirlit',
  Statistics = '/umsoknakerfi/tolfraedi',
  Translations = '/umsoknakerfi/thydingar',
  SharedNamespaceTranslationWorkspace = '/umsoknakerfi/thydingar/namespaces/:namespace',
  TranslationWorkspace = '/umsoknakerfi/thydingar/:typeId',
}

const sharedNamespaceTranslationPathPrefix = `${ApplicationSystemPaths.Translations}/namespaces/`
const legacySharedNamespaceTranslationPathPrefix = `${ApplicationSystemPaths.Translations}/shared/`

export const buildSharedNamespaceTranslationPath = (namespace: string) =>
  `${sharedNamespaceTranslationPathPrefix}${encodeURIComponent(namespace)}`

export const isSharedNamespaceTranslationPath = (pathname: string) =>
  pathname.startsWith(sharedNamespaceTranslationPathPrefix) ||
  pathname.startsWith(legacySharedNamespaceTranslationPathPrefix)

export const isApplicationTranslationWorkspacePath = (pathname: string) => {
  if (pathname === ApplicationSystemPaths.Translations) {
    return false
  }

  if (isSharedNamespaceTranslationPath(pathname)) {
    return false
  }

  return pathname.startsWith(`${ApplicationSystemPaths.Translations}/`)
}

export const APPLICATION_SYSTEM_TAB_QUERY_PARAM = 'tab'
export const APPLICATION_SYSTEM_TRANSLATIONS_TAB_ID = 'translations'

export const buildTranslationsBackPath = () =>
  `${ApplicationSystemPaths.Root}?${APPLICATION_SYSTEM_TAB_QUERY_PARAM}=${APPLICATION_SYSTEM_TRANSLATIONS_TAB_ID}`
