import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DrivingLicense } from '../../lib/types'
import { B_ADVANCED, BE, DrivingLicenseFakeData } from '../../lib/constants'

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

            if (fakeData?.useFakeData === 'yes') {
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

              age = fakeData?.age
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
                  categories?.some((c) => c.nr.toUpperCase() === 'BE') ||
                  // validToCode === 8 is temporary license and should not be applicable for BE
                  !categories?.some(
                    (c) => c.nr.toUpperCase() === 'B' && c.validToCode !== 8,
                  ),
              },
              {
                label: m.applicationForAdvancedLicenseTitle,
                subLabel: m.applicationForAdvancedLicenseDescription,
                value: B_ADVANCED,
                disabled: !categories?.some(
                  (c) => c.nr.toUpperCase() === 'B' && c.validToCode !== 8,
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
