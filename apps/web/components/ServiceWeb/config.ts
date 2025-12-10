import { Locale } from '@island.is/shared/types'
import { WatsonChatPanelProps } from '@island.is/web/components'

import { BackgroundVariations, Options } from './types'

export const options: Record<BackgroundVariations, Options> = {
  syslumenn: {
    textMode: 'light',
  },
  'district-commissioner': { textMode: 'light' },

  'stafraent-island': {
    textMode: 'dark',
  },
  'digital-iceland': {
    textMode: 'dark',
  },

  mannaudstorg: {
    textMode: 'light',
  },

  sjukratryggingar: {
    textMode: 'blueberry',
  },
  'icelandic-health-insurance': {
    textMode: 'blueberry',
  },
  'iceland-health': {
    textMode: 'blueberry',
  },

  utlendingastofnun: {
    textMode: 'light',
  },
  'directorate-of-immigration': {
    textMode: 'light',
  },

  samgongustofa: {
    textMode: 'light',
  },
  'transport-authority': {
    textMode: 'light',
  },

  hms: {
    textMode: 'dark',
  },

  default: {
    textMode: 'dark',
  },
}

enum Organization {
  /** Stafrænt Ísland */
  DIGITAL_ICELAND = '1JHJe1NDwbBjEr7OVdjuFD',

  /** Sýslumenn */
  DISTRICT_COMMISSIONER = 'kENblMMMvZ3DlyXw1dwxQ',

  /** Sjúkratryggingar */
  ICELANDIC_HEALTH_INSURANCE = '3pZwAagW0UY26giHaxHthe',

  /** Útlendingastofnun */
  DIRECTORATE_OF_IMMIGRATION = '77rXck3sISbMsUv7BO1PG2',

  /** Samgöngustofa */
  TRANSPORT_AUTHORITY = '6IZT17s7stKJAmtPutjpD7',
}

export const zendeskConfig: Record<
  Locale,
  Record<string, { snippetUrl: string }>
> = {
  is: {
    [Organization.TRANSPORT_AUTHORITY]: {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=6b9864d4-1892-4ea0-8d29-b609d7c53542',
    },
  },
  en: {
    [Organization.TRANSPORT_AUTHORITY]: {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=6b9864d4-1892-4ea0-8d29-b609d7c53542',
    },
  },
}

export const watsonConfig: Record<
  Locale,
  Record<string, WatsonChatPanelProps>
> = {
  is: {
    [Organization.DIGITAL_ICELAND]: {
      integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },
    [Organization.DISTRICT_COMMISSIONER]: {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },
    [Organization.ICELANDIC_HEALTH_INSURANCE]: {
      integrationID: 'e625e707-c9ce-4048-802c-c12b905c28be',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      region: 'eu-gb',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },
    [Organization.DIRECTORATE_OF_IMMIGRATION]: {
      integrationID: '89a03e83-5c73-4642-b5ba-cd3771ceca54',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },
  },
  en: {
    [Organization.DIGITAL_ICELAND]: {
      integrationID: '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },
    [Organization.ICELANDIC_HEALTH_INSURANCE]: {
      integrationID: 'cba41fa0-12fb-4cb5-bd98-66a57cee42e0',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },
    [Organization.DIRECTORATE_OF_IMMIGRATION]: {
      integrationID: '9e320784-ad44-4da9-9eb3-f305057a196a',
      region: 'eu-gb',
      serviceInstanceID: '2529638b-503c-4374-955c-0310139ec177',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },
  },
}

export default options
