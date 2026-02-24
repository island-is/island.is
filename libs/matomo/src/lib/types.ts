declare global {
  interface Window {
    _paq?: unknown[][]
  }
}

export interface MatomoInitScriptProps {
  matomoDomain: string
  matomoSiteId: string
}
