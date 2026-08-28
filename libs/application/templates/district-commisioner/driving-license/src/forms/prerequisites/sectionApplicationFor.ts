import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DrivingLicense } from '../../types'
import {
  B_FULL,
  B_FULL_RENEWAL_65,
  B_TEMP,
  DrivingLicenseFakeData,
} from '../../utils/constants'

export const sectionApplicationFor = (allow65Renewal = false) =>
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

              return options
            },
          }),
        ],
      }),
    ],
  })
