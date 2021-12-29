import {
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'

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
          options: [
            {
              value: FishingLicenseEnum.HOOKCATCHLIMIT,
              label: fishingLicense.labels.hookCatchLimit,
              tooltip: fishingLicense.labels.hookCatchLimitTooltip,
            },
            {
              value: FishingLicenseEnum.CATCHLIMIT,
              label: fishingLicense.labels.catchLimit,
              tooltip: fishingLicense.labels.catchLimitTooltip,
            },
          ],
        }),
      ],
    }),
  ],
})
