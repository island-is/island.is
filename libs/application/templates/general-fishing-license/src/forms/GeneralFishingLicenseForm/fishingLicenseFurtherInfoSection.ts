import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { fishingLicenseFurtherInformation } from '../../lib/messages'

export const fishingLicenseFurtherInfoSection = buildSection({
  id: 'fishingLicenseFurtherInformationSection',
  title: fishingLicenseFurtherInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'fishingLicenseFurtherInformation',
      title: fishingLicenseFurtherInformation.general.title,
      description: '',
      children: [
        buildCustomField({
          id: 'fishingLicenseFurtherInformation',
          title: '',
          doesNotRequireAnswer: true,
          component: 'FishingLicenseFurtherInfo',
        }),
      ],
    }),
  ],
})
