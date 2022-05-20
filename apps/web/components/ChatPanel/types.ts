import { boostChatPanelEndpoints } from './BoostChatPanel/config'

export interface BoostChatPanelProps {
  endpoint: keyof typeof boostChatPanelEndpoints
  pushUp?: boolean
}

export interface LiveChatIncChatPanelProps {
  license: number
  version: string
}

export interface WatsonChatPanelProps {
  // The region your integration is hosted in.
  region: string

  integrationID: string
  serviceInstanceID: string
  version?: string
  carbonTheme?: string
  cssVariables?: Record<string, string>

  // What key in the 'ChatPanels' UI Configuration in Contentful stores the language pack for this chat bot
  namespaceKey?: 'default'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoad?: (instance: any) => void

  // Whether the default launcher is shown
  showLauncher?: boolean
}
