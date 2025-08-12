import {
  buildCheckboxField,
  buildMultiField,
  buildSection,
  buildSelectField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { drivingLicenses } from '../../lib/messages'
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
} from '../../assets/drivingLicenses'

export const drivingLicensesSection = buildSection({
  id: 'drivingLicensesSection',
  title: drivingLicenses.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'drivingLicensesMultiField',
      title: drivingLicenses.general.pageTitle,
      description: drivingLicenses.general.description,
      children: [
        buildCheckboxField({
          id: 'drivingLicense.hasDrivingLicense',

          options: [
            {
              value: YES,
              label: drivingLicenses.labels.hasDrivingLicenseLabel,
            },
          ],
          clearOnChange: ['drivingLicense.drivingLicenseType'],
        }),
        buildCheckboxField({
          id: 'drivingLicense.drivingLicenseType',
          title: drivingLicenses.labels.drivingLicenseType,
          spacing: 0,
          options: (application) => {
            const drivingLicenseTypes =
              getValueViaPath<{ name: string; id: string }[]>(
                application.externalData,
                'activityGrantApplication.data.activationGrant.supportData.drivingLicenses',
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
                value: type.id,
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
              label: drivingLicenses.labels.hasHeavyMachineryLicenseLabel,
            },
          ],
          clearOnChange: ['drivingLicense.heavyMachineryLicenses'],
        }),
        buildSelectField({
          id: 'drivingLicense.heavyMachineryLicenses',
          title: drivingLicenses.labels.workMachineRights,
          isMulti: true,
          options: (application) => {
            const heavyMachineryLicenses =
              getValueViaPath<{ name: string; id: string }[]>(
                application.externalData,
                'activityGrantApplication.data.activationGrant.supportData.heavyMachineryLicenses',
              ) || []
            return heavyMachineryLicenses
              .map((right) => ({
                value: right.id,
                label: right.name,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))
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
