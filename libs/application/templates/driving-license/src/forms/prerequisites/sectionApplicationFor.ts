import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DrivingLicense } from '../../lib/types'
import { B_FULL, B_TEMP, BE, DrivingLicenseFakeData } from '../../lib/constants'

export const sectionApplicationFor = (allowBELicense = false) =>
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
            title: '',
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

              const age =
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
                  fakeData.currentLicense === 'full'
                    ? [{ nr: 'B' }]
                    : fakeData.currentLicense === 'BE'
                    ? [{ nr: 'B' }, { nr: 'BE' }]
                    : null
              }

              let options = [
                {
                  label: m.applicationForTempLicenseTitle,
                  subLabel:
                    m.applicationForTempLicenseDescription.defaultMessage,
                  value: B_TEMP,
                  disabled: !!currentLicense,
                },
                {
                  label: m.applicationForFullLicenseTitle,
                  subLabel:
                    m.applicationForFullLicenseDescription.defaultMessage,
                  value: B_FULL,
                  disabled: !currentLicense,
                },
              ]

              if (allowBELicense) {
                options = options.concat({
                  label: m.applicationForBELicenseTitle,
                  subLabel: m.applicationForBELicenseDescription.defaultMessage,
                  value: BE,
                  disabled:
                    !currentLicense ||
                    age < 18 ||
                    categories?.some((c) => c.nr.toUpperCase() === 'BE') ||
                    !categories?.some((c) => c.nr.toUpperCase() === 'B'),
                })
              }

              return options
            },
          }),
        ],
      }),
    ],
  })
