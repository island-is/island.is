import { endpoints } from './BoostChatPanel/config'

export interface BoostChatPanelProps {
  endpoint: keyof typeof endpoints
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
  languagePack?: Record<string, string>

  // Whether the default launcher is shown
  showLauncher?: boolean
}
