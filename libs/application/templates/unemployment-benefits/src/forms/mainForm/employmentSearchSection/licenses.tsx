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

export const licensesSubSection = buildSubSection({
  id: 'licensesSubSection',
  title: employmentSearchMessages.licenses.sectionTitle,
  children: [
    buildMultiField({
      id: 'licensesSubSection',
      title: employmentSearchMessages.licenses.pageTitle,
      description: employmentSearchMessages.licenses.pageDescription,
      children: [
        buildCheckboxField({
          id: 'licenses.hasDrivingLicense',

          options: [
            {
              value: YES,
              label: employmentSearchMessages.licenses.hasDrivingLicenseLabel,
            },
          ],
        }),
        buildCheckboxField({
          id: 'licenses.drivingLicenseTypes',
          title: employmentSearchMessages.licenses.drivingLicenseTypeLabel,
          spacing: 0,
          required: true,
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
                'licenses.hasDrivingLicense',
              )?.includes(YES) ?? false
            )
          },
        }),
        buildCheckboxField({
          id: 'licenses.hasHeavyMachineryLicense',
          spacing: 0,
          options: [
            {
              value: YES,
              label:
                employmentSearchMessages.licenses.hasHeavyMachineryLicenseLabel,
            },
          ],
        }),
        buildSelectField({
          id: 'licenses.heavyMachineryLicensesTypes',
          title: employmentSearchMessages.licenses.heavyMachineryLicenses,
          required: true,
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
                'licenses.hasHeavyMachineryLicense',
              )?.includes(YES) ?? false
            )
          },
        }),
      ],
    }),
  ],
})
