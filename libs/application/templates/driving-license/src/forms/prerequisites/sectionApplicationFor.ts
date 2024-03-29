import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DrivingLicense } from '../../lib/types'
import { B_FULL, B_TEMP } from '../../shared'

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
          title: '',
          backgroundColor: 'white',
          largeButtons: true,
          options: (app) => {
            const { currentLicense } = getValueViaPath<DrivingLicense>(
              app.externalData,
              'currentLicense.data',
            ) ?? { currentLicense: null }

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
                disabled: !currentLicense,
              },
            ]
          },
        }),
      ],
    }),
  ],
})
