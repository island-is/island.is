export interface BoostChatPanelProps {
  id: string
  conversationKey: string
  url: string
  pushUp?: boolean
}

export interface LiveChatIncChatPanelProps {
  license: string
  version: string
  group?: string
  // Whether the default LiveChatInc launcher is shown
  showLauncher?: boolean
  pushUp?: boolean
}

export interface WatsonChatPanelProps {
  // The region your integration is hosted in.
  region: string

  integrationID: WatsonIntegration
  serviceInstanceID: WatsonServiceInstance
  version?: string
  carbonTheme?: string

  // What key in the 'ChatPanels' UI Configuration in Contentful stores the language pack for this chat bot
  namespaceKey?:
    | 'default'
    | 'ukrainian-citizens'
    | 'skatturinn'
    | 'samgongustofa'

  serviceDesk?: {
    integrationType: 'genesyswebmessenger'
    genesysMessenger: {
      scriptURL: string
      deploymentID: string
      environment: string
    }
    skipConnectAgentCard: boolean
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoad?: (instance: any) => void

  // Whether the default IBM Watson launcher is shown
  showLauncher?: boolean

  // If don't use the default launcher that IBM Watson provides, should the chat bubble launcher be pushed up?
  pushUp?: boolean
}

export interface ZendeskChatPanelProps {
  snippetUrl: string
  pushUp?: boolean
  chatBubbleVariant?: 'default' | 'circle'
}

export type WatsonIntegration =
  // Askur
  | 'b1a80e76-da12-4333-8872-936b08246eaa'

  // Askur syslumenn
  | '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f'

  // Askur - english
  | '2e32cba8-7379-44e9-b03e-af1ccdbe5982'

  // Útlendingastofnun
  | '89a03e83-5c73-4642-b5ba-cd3771ceca54'

  // Útlendingastofnun - english
  | '9e320784-ad44-4da9-9eb3-f305057a196a'

  // Sjúkratryggingar
  | 'e625e707-c9ce-4048-802c-c12b905c28be'

  // Sjúkratryggingar - english
  | 'cba41fa0-12fb-4cb5-bd98-66a57cee42e0'

  // Askur - stofnanir
  | '9aed32e0-8009-49ef-8c26-1220ed86e250'

  // Grindavík
  | 'fd247025-59fc-4ccd-83eb-7ae960019e37'

  // Grindavík - english
  | 'e72d26ef-92eb-4e66-bdae-1f13a72a887a'

  // Skatturinn
  | '84f62b21-aa50-4d49-b413-597b6a959910'

  // Skatturinn - english
  | '98ba51da-1677-4881-a133-7ea019ae7b87'

  // Samgöngustofa
  | 'b0b445a4-4c49-4c79-9731-8d03f49c8cac'

  // Samgöngustofa - english
  | 'ee1c15db-7151-4487-bc9a-9f32f1f8ae3b'

  // Gott að eldast
  | '580730f3-3d88-4c5a-92e6-30e79ea09f24'

export type WatsonServiceInstance =
  // Askur
  | 'bc3d8312-d862-4750-b8bf-529db282050a'
  // Útlendingastofnun - english
  | '2529638b-503c-4374-955c-0310139ec177'
