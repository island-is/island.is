declare global {
  interface Window {
    _paq?: unknown[][]
  }
}

export interface MatomoInitScriptProps {
  enabled?: boolean;
  matomoDomain: string
  matomoSiteId: string
}
