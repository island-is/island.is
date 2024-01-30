export type WatsonInstanceEvent = {
  type: string
  data: { message: { user_defined: Record<string, string> } }
  identityToken: string
}

export interface WatsonInstance {
  destroy: () => void
  render: () => Promise<void>
  openWindow: () => void
  updateCSSVariables: (cssVariables: Record<string, string>) => void
  updateLanguagePack: (languagePack: Record<string, string>) => void
  updateIdentityToken: (token: string) => void
  on: (eventHandler: {
    type: string
    handler: (event: WatsonInstanceEvent, instance: WatsonInstance) => void
  }) => void
  customPanels: {
    getPanel: () => {
      hostElement: HTMLElement
      open: (props: { title: string; hideBackButton?: boolean }) => void
      close: () => void
    }
  }
}
