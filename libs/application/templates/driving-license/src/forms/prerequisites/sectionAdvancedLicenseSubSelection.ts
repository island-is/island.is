import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DrivingLicense } from '../../lib/types'
import {
  ADVANCED_LICENSES,
  AdvancedLicense,
  advancedLicenseToSubLicenseMap,
  AdvancedSubLicenses,
  B_ADVANCED,
  B_FULL,
  B_FULL_RENEWAL_65,
  B_TEMP,
  BE,
  DrivingLicenseFakeData,
  LicenseTypes,
  NO,
  YES,
} from '../../lib/constants'

export const sectionAdvancedLicenseSubSelection = buildSubSection({
  id: 'advancedLicenseSubSelection',
  title: m.applicationForAdvancedLicenseTitle,
  condition: (answers) => {
    const applicationFor = getValueViaPath<LicenseTypes>(
      answers,
      'applicationFor',
    )

    const advancedLicenseSelection = getValueViaPath<LicenseTypes>(
      answers,
      'advancedLicenseSelection',
    )

    if (
      advancedLicenseSelection &&
      applicationFor === LicenseTypes.B_ADVANCED
    ) {
      return Object.keys(advancedLicenseToSubLicenseMap).includes(
        advancedLicenseSelection,
      )
    }

    return false
  },
  children: [
    buildMultiField({
      id: 'info',
      title: (application) => {
        const { advancedLicenseSelection } = application.answers as {
          advancedLicenseSelection: keyof typeof advancedLicenseToSubLicenseMap
        }

        if (advancedLicenseSelection) {
          return m[
            `applicationForAdvancedLicenseApplyFor${advancedLicenseSelection}`
          ]
        }

        return ''
      },
      children: [
        buildRadioField({
          id: 'advancedSubLicenseSelection',
          title: (application) => {
            const { advancedLicenseSelection } = application.answers as {
              advancedLicenseSelection: keyof typeof advancedLicenseToSubLicenseMap
            }

            if (advancedLicenseSelection) {
              const key =
                `applicationForAdvancedLicenseQuestion${advancedLicenseSelection}` as keyof typeof m

              if (Object.prototype.hasOwnProperty.call(m, key) && m?.[key]) {
                return m[key]
              }
            }

            return ''
          },
          width: 'half',
          options: (application) => {
            return [
              {
                value: 'y',
                label: 'Já',
              },
              {
                value: '',
                label: 'Nei',
              },
            ]
          },
        }),
      ],
    }),
  ],
})
