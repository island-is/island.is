import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DrivingLicense } from '../../lib/types'
import {
  B_ADVANCED,
  BE,
  DrivingLicenseFakeData,
  TEMPORARY_LICENSE_VALIDTO_CODE,
} from '../../lib/constants'
import { hasSelectableAdvancedCategories } from '../../lib/utils'

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
          backgroundColor: 'white',
          largeButtons: true,
          options: (app) => {
            let { currentLicense } = getValueViaPath<DrivingLicense>(
              app.externalData,
              'currentLicense.data',
            ) ?? { currentLicense: null }

            let { categories } = getValueViaPath<DrivingLicense>(
              app.externalData,
              'currentLicense.data',
            ) ?? { categories: null }

            let age =
              getValueViaPath<number>(
                app.externalData,
                'nationalRegistry.data.age',
              ) ?? 0

            const fakeData = getValueViaPath<DrivingLicenseFakeData>(
              app.answers,
              'fakeData',
            )

            if (fakeData?.useFakeData === YES) {
              // 'none' must stay falsy — it is a string, so it would
              // otherwise read as "has a license" and disable B-temp.
              currentLicense =
                fakeData.currentLicense && fakeData.currentLicense !== 'none'
                  ? fakeData.currentLicense
                  : null
              categories =
                fakeData.currentLicense === 'temp'
                  ? [{ nr: 'B', validToCode: 8 }]
                  : fakeData.currentLicense === 'B'
                  ? [{ nr: 'B', validToCode: 9 }]
                  : fakeData.currentLicense === 'BE'
                  ? [
                      { nr: 'B', validToCode: 9 },
                      { nr: 'BE', validToCode: 9 },
                    ]
                  : []

              age = Number(fakeData?.age) || 0
            }

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
                  // already holds, every advanced category — don't let them
                  // into a flow that would dead-end on the selection screen.
                  !hasSelectableAdvancedCategories(
                    age,
                    (categories ?? [])
                      .map((c) => c.nr)
                      .filter((nr): nr is string => !!nr),
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
