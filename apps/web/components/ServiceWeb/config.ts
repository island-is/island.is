import { WatsonChatPanelProps } from '@island.is/web/components'
import { Locale } from 'locale'
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
  default: {
    textMode: 'dark',
  },
}

enum Organization {
  /** Stafrænt Ísland */
  DIGITAL_ICELAND = '1JHJe1NDwbBjEr7OVdjuFD',

  /** Sýslumenn */
  DISTRICT_COMMISSIONER = 'kENblMMMvZ3DlyXw1dwxQ',
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
