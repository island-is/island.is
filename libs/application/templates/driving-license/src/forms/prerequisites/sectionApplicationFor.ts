import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DrivingLicense } from '../../lib/types'
import {
  B_FULL,
  B_FULL_RENEWAL_65,
  B_TEMP,
  DrivingLicenseFakeData,
} from '../../lib/constants'
import { info } from 'kennitala'

export const sectionApplicationFor = buildSubSection({
  id: 'applicationFor',
  title: m.applicationDrivingLicenseTitle,
  children: [
    buildMultiField({
      id: 'info',
      title: m.drivingLicenseApplyingForTitle,
      children: [
        buildRadioField({
          id: 'applicationFor',
          backgroundColor: 'white',
          title: '',
          description: '',
          space: 0,
          largeButtons: true,
          options: (app) => {
            let { currentLicense } = getValueViaPath<DrivingLicense>(
              app.externalData,
              'currentLicense.data',
            ) ?? { currentLicense: null }

            let age = info(app.applicant).age

            const fakeData = getValueViaPath<DrivingLicenseFakeData>(
              app.answers,
              'fakeData',
            )
            if (fakeData?.useFakeData === 'yes') {
              currentLicense = fakeData.currentLicense ?? null
              age = fakeData.age
            }

            return [
              {
                label: m.applicationForTempLicenseTitle,
                subLabel: m.applicationForTempLicenseDescription.defaultMessage,
                value: B_TEMP,
                disabled: !!currentLicense,
              },
              {
                label: m.applicationForFullLicenseTitle,
                subLabel: m.applicationForFullLicenseDescription.defaultMessage,
                value: B_FULL,
                disabled: !currentLicense || age >= 65,
              },
              {
                label: m.applicationForRenewalLicenseTitle,
                subLabel:
                  m.applicationForRenewalLicenseDescription.defaultMessage,
                value: B_FULL_RENEWAL_65,
                disabled: !currentLicense || age < 65,
              },
            ]
          },
        }),
      ],
    }),
  ],
})
