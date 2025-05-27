import {
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'

export const drivingLicenseSubSection = buildSubSection({
  id: 'drivingLicenseSubSection',
  title: employmentSearchMessages.drivingLicense.sectionTitle,
  children: [
    buildMultiField({
      id: 'drivingLicenseSubSection',
      title: employmentSearchMessages.drivingLicense.pageTitle,
      description: employmentSearchMessages.drivingLicense.pageDescription,
      children: [
        buildSelectField({
          id: 'drivingLicense.drivingLicenseType',
          title:
            employmentSearchMessages.drivingLicense.drivingLicenseTypeLabel,
          isMulti: true,
          options: (application) => {
            const drivingLicenseTypes =
              getValueViaPath<{ name: string }[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.drivingLicenseTypes',
              ) || []
            return drivingLicenseTypes.map((type) => ({
              value: type.name,
              label: type.name,
            }))
          },
        }),
        buildSelectField({
          id: 'drivingLicense.heavyMachineryLicenses',
          title: employmentSearchMessages.drivingLicense.heavyMachineryLicenses,
          isMulti: true,
          options: (application) => {
            const heavyMachineryLicenses =
              getValueViaPath<{ name: string }[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.heavyMachineryLicenses',
              ) || []
            return heavyMachineryLicenses.map((right) => ({
              value: right.name,
              label: right.name,
            }))
          },
        }),
      ],
    }),
  ],
})
