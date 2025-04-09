import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'

export const drivingLicenseSubSection = buildSubSection({
  id: 'drivingLicenseSubSection',
  title: employmentSearchMessages.drivingLicense.sectionTitle,
  children: [
    buildMultiField({
      id: 'drivingLicenseSubSection',
      title: employmentSearchMessages.drivingLicense.pageTitle,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
