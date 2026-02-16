declare global {
  interface Window {
    _paq?: unknown[][]
  }
}

export interface MatomoPageAttributes {
  organization?: string | null
  category?: string
}

export interface MatomoContextValue {
  /**
   * Set a custom attribute that will be sent with the next page view
   */
  setAttribute: <K extends keyof MatomoPageAttributes>(
    key: K,
    value: MatomoPageAttributes[K],
  ) => void
  /**
   * Set multiple custom attributes at once
   */
  setAttributes: (attributes: MatomoPageAttributes) => void
  /**
   * Get current custom attributes (read-only snapshot)
   */
  getAttributes: () => MatomoPageAttributes
}
