import {
  buildMultiField,
  buildRadioField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { DrivingLicense } from '../../../lib/types'
import {
  B_ADVANCED,
  BE,
  DrivingLicenseFakeData,
  getApplicantAge,
  getHeldCategories,
  isEligibleForBAdvanced,
  isEligibleForBE,
} from '../../../utils'

export const sectionApplicationFor = buildSection({
  id: 'applicationFor',
  title: m.applicationDrivingLicenseTitle,
  children: [
    buildMultiField({
      id: 'info',
      title: m.applicationDrivingLicenseTitle,
      description: m.drivingLicenseApplyingForTitle,
      children: [
        buildRadioField({
          id: 'applicationFor',
          options: (app) => {
            const fakeData = getValueViaPath<DrivingLicenseFakeData>(
              app.answers,
              'fakeData',
            )

            // Shared with the AdvancedLicenseSelection screen so this
            // eligibility gate and the selection screen agree on age and on
            // which advanced categories the applicant already holds.
            const age = getApplicantAge(app.externalData, fakeData)
            const heldCategories = getHeldCategories(app.externalData)

            // Fake-vs-real is resolved by the CurrentLicense data provider, so
            // this screen just reads the resolved license and stays agnostic to
            // where the data came from.
            const currentLicenseData = getValueViaPath<DrivingLicense>(
              app.externalData,
              'currentLicense.data',
            )
            const currentLicense = currentLicenseData?.currentLicense ?? null
            const categories = currentLicenseData?.categories ?? null

            const options = [
              {
                label: m.applicationForBELicenseTitle,
                subLabel: m.applicationForBELicenseDescription,
                value: BE,
                disabled: !isEligibleForBE(currentLicense, categories, age),
              },
              {
                label: m.applicationForAdvancedLicenseTitle,
                subLabel: m.applicationForAdvancedLicenseDescription,
                value: B_ADVANCED,
                // Nothing to apply for if the applicant is too young for, or
                // already holds, every advanced category, so don't let them
                // into a flow that would dead-end on the selection screen.
                disabled: !isEligibleForBAdvanced(
                  categories,
                  age,
                  heldCategories,
                ),
              },
            ]

            return options
          },
        }),
      ],
    }),
  ],
})
