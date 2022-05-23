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

  integrationID: WatsonIntegration
  serviceInstanceID: WatsonServiceInstance
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

export type WatsonIntegration =
  // Askur
  | 'b1a80e76-da12-4333-8872-936b08246eaa'

  // Askur syslumenn
  | '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f'

export type WatsonServiceInstance =
  // Askur
  'bc3d8312-d862-4750-b8bf-529db282050a'
