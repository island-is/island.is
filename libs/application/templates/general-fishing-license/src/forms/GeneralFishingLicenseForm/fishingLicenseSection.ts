import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

import { fishingLicense } from '../../lib/messages'

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
          id: 'fishingLicense',
          doesNotRequireAnswer: true,
          component: 'FishingLicense',
        }),
      ],
    }),
  ],
})
