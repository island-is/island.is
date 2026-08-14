import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DrivingLicense } from '../../lib/types'
import {
  B_ADVANCED,
  BE,
  DrivingLicenseFakeData,
  getApplicantAge,
  getHeldCategories,
  hasSelectableAdvancedCategories,
  TEMPORARY_LICENSE_VALIDTO_CODE,
} from '../../utils'

export const sectionApplicationFor = buildSubSection({
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
            const heldCategories = getHeldCategories(app.externalData, fakeData)

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
                disabled:
                  !currentLicense ||
                  age < 18 ||
                  age >= 65 ||
                  categories?.some((c) => c.nr?.toUpperCase() === BE) ||
                  // A temporary licence is not eligible to apply for BE.
                  !categories?.some(
                    (c) =>
                      c.nr?.toUpperCase() === 'B' &&
                      c.validToCode !== TEMPORARY_LICENSE_VALIDTO_CODE,
                  ),
              },
              {
                label: m.applicationForAdvancedLicenseTitle,
                subLabel: m.applicationForAdvancedLicenseDescription,
                value: B_ADVANCED,
                disabled:
                  !categories?.some(
                    (c) =>
                      c.nr?.toUpperCase() === 'B' &&
                      c.validToCode !== TEMPORARY_LICENSE_VALIDTO_CODE,
                  ) ||
                  // Nothing to apply for if the applicant is too young for, or
                  // already holds, every advanced category, so don't let them
                  // into a flow that would dead-end on the selection screen.
                  !hasSelectableAdvancedCategories(age, heldCategories),
              },
            ]

            return options
          },
        }),
      ],
    }),
  ],
})
