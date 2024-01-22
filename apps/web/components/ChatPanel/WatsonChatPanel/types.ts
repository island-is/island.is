export interface WatsonInstance {
  destroy: () => void
  render: () => Promise<void>
  openWindow: () => void
  updateCSSVariables: (cssVariables: Record<string, string>) => void
  updateLanguagePack: (languagePack: Record<string, string>) => void
}
