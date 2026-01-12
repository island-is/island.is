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
  B_FULL,
  B_FULL_RENEWAL_65,
  B_TEMP,
  BE,
  DrivingLicenseFakeData,
} from '../../lib/constants'

export const sectionApplicationFor = (
  allowBELicense = false,
  allow65Renewal = false,
  allowAdvanced = false,
) =>
  buildSubSection({
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
                currentLicense = fakeData.currentLicense ?? null
                categories =
                  fakeData.currentLicense === 'temp'
                    ? [{ nr: 'B', validToCode: 8 }]
                    : fakeData.currentLicense === 'full'
                    ? [{ nr: 'B', validToCode: 9 }]
                    : fakeData.currentLicense === 'BE'
                    ? [
                        { nr: 'B', validToCode: 9 },
                        { nr: 'BE', validToCode: 9 },
                      ]
                    : []

                age = fakeData?.age
              }

              let options = [
                {
                  label: m.applicationForTempLicenseTitle,
                  subLabel: m.applicationForTempLicenseDescription,
                  value: B_TEMP,
                  disabled: !!currentLicense,
                },
                {
                  label: m.applicationForFullLicenseTitle,
                  subLabel: m.applicationForFullLicenseDescription,
                  value: B_FULL,
                  disabled: !currentLicense,
                },
              ]

              if (allow65Renewal) {
                options = options.concat({
                  label: m.applicationForRenewalLicenseTitle,
                  subLabel: m.applicationForRenewalLicenseDescription,
                  value: B_FULL_RENEWAL_65,
                  disabled: !currentLicense || age < 65,
                })
              }

              if (allowBELicense) {
                options = options.concat({
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
                })
              }

              if (allowAdvanced) {
                options = options.concat({
                  label: m.applicationForAdvancedLicenseTitle,
                  subLabel: m.applicationForAdvancedLicenseDescription,
                  value: B_ADVANCED,
                  disabled: !categories?.some(
                    (c) => c.nr.toUpperCase() === 'B' && c.validToCode !== 8,
                  ),
                })
              }

              return options
            },
          }),
        ],
      }),
    ],
  })
