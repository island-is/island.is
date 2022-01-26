import {
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { getFishingLicenseOptions } from '../../../utils'

import { fishingLicense } from '../../lib/messages'
import { FishingLicenseEnum } from '../../types'

export const fishingLicenseSection = buildSection({
  id: 'fishingLicenseSection',
  title: fishingLicense.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'fishingLicense',
      title: fishingLicense.general.title,
      description: fishingLicense.general.description,
      children: [
        buildCustomField({
          id: 'fishingLicenseCustomField',
          title: '',
          doesNotRequireAnswer: true,
          component: 'FishingLicense',
        }),
        buildRadioField({
          id: 'fishingLicense',
          title: fishingLicense.labels.radioButtonTitle,
          largeButtons: true,
          options: (application) =>
            getFishingLicenseOptions(application.answers),
        }),
      ],
    }),
  ],
})
