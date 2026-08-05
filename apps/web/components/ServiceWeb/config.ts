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
    textMode: 'light',
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

export default options
