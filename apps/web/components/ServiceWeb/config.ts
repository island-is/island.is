import { Locale } from '@island.is/shared/types'
import type {
  WatsonChatPanelProps,
  ZendeskChatPanelProps,
} from '@island.is/web/components'

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

  /** Skatturinn */
  SKATTURINN = '4yJlHgCMTqpgRSj4p6LuBQ',

  /** Vinnueftirlitið */
  VINNUEFTIRLITID = '39S5VumPfb1hXBJm3SnE02',
}

export const zendeskConfig: Record<
  Locale,
  Record<string, ZendeskChatPanelProps>
> = {
  is: {
    [Organization.ICELANDIC_HEALTH_INSURANCE]: {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=9989d2fe-0b2e-40a8-bc4e-33e5e4c07359',
    },
    [Organization.DIRECTORATE_OF_IMMIGRATION]: {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=34869229-7aad-4b2f-90b2-f2984fdd14dc',
    },
    [Organization.DISTRICT_COMMISSIONER]: {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=dc0c86b4-a02a-45e9-85d5-0aa570708ad9',
    },
    [Organization.SKATTURINN]: {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=f12bfedb-fc2c-477d-8f28-b31a036fba35',
    },
    [Organization.VINNUEFTIRLITID]: {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=a08836d9-21d0-44cf-a61d-4c2a20833140',
      chatBubbleVariant: 'default',
    },
  },
  en: {
    [Organization.ICELANDIC_HEALTH_INSURANCE]: {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=9989d2fe-0b2e-40a8-bc4e-33e5e4c07359',
    },
    [Organization.DIRECTORATE_OF_IMMIGRATION]: {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=34869229-7aad-4b2f-90b2-f2984fdd14dc',
    },
    [Organization.DISTRICT_COMMISSIONER]: {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=dc0c86b4-a02a-45e9-85d5-0aa570708ad9',
    },
    [Organization.SKATTURINN]: {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=f12bfedb-fc2c-477d-8f28-b31a036fba35',
    },
    [Organization.VINNUEFTIRLITID]: {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=a08836d9-21d0-44cf-a61d-4c2a20833140',
      chatBubbleVariant: 'default',
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
    [Organization.TRANSPORT_AUTHORITY]: {
      integrationID: 'b0b445a4-4c49-4c79-9731-8d03f49c8cac',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'samgongustofa',
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
    [Organization.TRANSPORT_AUTHORITY]: {
      integrationID: 'ee1c15db-7151-4487-bc9a-9f32f1f8ae3b',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'samgongustofa',
    },
  },
}

export default options
