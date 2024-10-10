import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DrivingLicense } from '../../lib/types'
import {
  AdvancedLicense,
  AdvancedLicenses,
  B_ADVANCED,
  B_FULL,
  B_FULL_RENEWAL_65,
  B_TEMP,
  BE,
  DrivingLicenseFakeData,
  LicenseTypes,
} from '../../lib/constants'

export const sectionAdvancedLicenseSelection = buildSubSection({
  id: 'advancedLicenseSelection',
  title: m.applicationForAdvancedLicenseTitle,
  condition: (answers) => {
    const applicationFor = getValueViaPath<LicenseTypes>(
      answers,
      'applicationFor',
    )

    return applicationFor === LicenseTypes.B_ADVANCED
  },
  children: [
    buildMultiField({
      id: 'advancedLicenseSelection',
      title: m.applicationForAdvancedLicenseTitle,
      description: m.applicationForAdvancedLicenseDescription,
      children: [
        buildRadioField({
          id: 'advancedLicenseSelection',
          title: '',
          backgroundColor: 'white',
          largeButtons: true,
          options: (app) => {
            console.log(app)
            let options = []

            options = Object.values(AdvancedLicenses).map((license) => {
              return {
                label: m[`applicationForAdvancedLicenseApplyFor${license}`],
                value: AdvancedLicenses[license],
                disabled: false,
              }
            })

            return options
          },
        }),
      ],
    }),
  ],
})
