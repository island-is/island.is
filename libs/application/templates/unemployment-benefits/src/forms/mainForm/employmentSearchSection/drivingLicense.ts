import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  getValueViaPath,
  YES,
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
        buildCheckboxField({
          id: 'drivingLicense.hasDrivingLicense',
          spacing: 0,
          options: [
            {
              value: YES,
              label:
                employmentSearchMessages.drivingLicense.hasDrivingLicenseLabel,
            },
          ],
        }),
        buildCustomField({
          id: 'drivingLicense.drivingLicenseType',
          component: 'DrivingLicenseCheckbox',
          condition: (answers) => {
            return (
              getValueViaPath<string[]>(
                answers,
                'drivingLicense.hasDrivingLicense',
              )?.includes(YES) ?? false
            )
          },
        }),
        // buildSelectField({
        //   id: 'drivingLicense.drivingLicenseType',
        //   title:
        //     employmentSearchMessages.drivingLicense.drivingLicenseTypeLabel,
        //   isMulti: true,
        //   options: (application) => {
        //     const drivingLicenseTypes =
        //       getValueViaPath<{ name: string }[]>(
        //         application.externalData,
        //         'unemploymentApplication.data.supportData.drivingLicenseTypes',
        //       ) || []
        //     return drivingLicenseTypes.map((type) => ({
        //       value: type.name,
        //       label: type.name,
        //     }))
        //   },
        //   condition: (answers) => {
        //     return (
        //       getValueViaPath<string[]>(
        //         answers,
        //         'drivingLicense.hasDrivingLicense',
        //       )?.includes(YES) ?? false
        //     )
        //   },
        // }),
        buildCheckboxField({
          id: 'drivingLicense.hasHeavyMachineryLicense',
          spacing: 0,
          options: [
            {
              value: YES,
              label:
                employmentSearchMessages.drivingLicense
                  .hasHeavyMachineryLicenseLabel,
            },
          ],
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
          condition: (answers) => {
            return (
              getValueViaPath<string[]>(
                answers,
                'drivingLicense.hasHeavyMachineryLicense',
              )?.includes(YES) ?? false
            )
          },
        }),
      ],
    }),
  ],
})
