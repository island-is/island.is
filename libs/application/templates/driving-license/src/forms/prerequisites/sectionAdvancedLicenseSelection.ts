import {
  buildCustomField,
  buildKeyValueField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { LicenseTypes } from '../../lib/constants'

export const sectionAdvancedLicenseSelection = buildSubSection({
  id: 'sectionAdvancedLicenseSelection',
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
      id: 'advancedLicenseSelectionFields',
      title: m.applicationForAdvancedLicenseTitle,
      description: m.applicationForAdvancedLicenseDescription,
      children: [
        buildCustomField({
          id: 'advancedLicense',
          title: 'Advanced License',
          component: 'AdvancedLicense',
        }),
        // buildRadioField({
        //   id: 'advancedLicense',
        //   title: '',
        //   backgroundColor: 'blue',
        //   largeButtons: true,
        //   options: (app) => {
        //     console.log(app)
        //     let options = []

        //     options = Object.values(AdvancedLicenses).map((license) => {
        //       return {
        //         label: m[`applicationForAdvancedLicenseApplyFor${license}`],
        //         value: AdvancedLicenses[license],
        //         disabled: false,
        //       }
        //     })

        //     return options
        //   },
        // }),
      ],
    }),
  ],
})
