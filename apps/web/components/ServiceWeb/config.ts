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

  /** Skatturinn */
  SKATTURINN = '4yJlHgCMTqpgRSj4p6LuBQ',
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
  },
}

export default options
