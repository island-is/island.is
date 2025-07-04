import {
  buildCheckboxField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  A,
  A1,
  A2,
  AM,
  B,
  BE,
  C1E,
  CE,
  D,
  D1,
  D1E,
  DE,
} from '../../../assets/drivingLicenses'
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

          options: [
            {
              value: YES,
              label:
                employmentSearchMessages.drivingLicense.hasDrivingLicenseLabel,
            },
          ],
        }),
        buildCheckboxField({
          id: 'drivingLicense.drivingLicenseType',
          title:
            employmentSearchMessages.drivingLicense.drivingLicenseTypeLabel,
          spacing: 0,
          options: (application) => {
            const drivingLicenseTypes =
              getValueViaPath<{ name: string }[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.drivingLicenses',
              ) || []
            return drivingLicenseTypes.map((type) => {
              const licenseComponents: Record<string, React.ComponentType> = {
                A,
                A1,
                A2,
                AM,
                B,
                BE,
                C1E,
                CE,
                D,
                D1,
                D1E,
                DE,
              }

              const LicenseIconComponent = licenseComponents[type.name]
              return {
                value: type.name,
                label: type.name,
                rightContent: LicenseIconComponent ? (
                  <LicenseIconComponent />
                ) : null,
              }
            })
          },
          condition: (answers) => {
            return (
              getValueViaPath<string[]>(
                answers,
                'drivingLicense.hasDrivingLicense',
              )?.includes(YES) ?? false
            )
          },
        }),
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
