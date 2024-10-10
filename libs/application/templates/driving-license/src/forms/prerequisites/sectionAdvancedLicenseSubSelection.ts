import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  advancedLicenseToSubLicenseMap,
  LicenseTypes,
  NO,
} from '../../lib/constants'

export const sectionAdvancedLicenseSubSelection = buildSubSection({
  id: 'sectionAdvancedLicenseSubSelection',
  title: m.applicationForAdvancedLicenseTitle,
  condition: (answers) => {
    const applicationFor = getValueViaPath<LicenseTypes>(
      answers,
      'applicationFor',
    )

    const advancedLicense = getValueViaPath<LicenseTypes>(
      answers,
      'advancedLicense',
    )

    if (advancedLicense && applicationFor === LicenseTypes.B_ADVANCED) {
      return Object.keys(advancedLicenseToSubLicenseMap).includes(
        advancedLicense,
      )
    }

    return false
  },
  children: [
    buildMultiField({
      id: 'info',
      title: (application) => {
        const { advancedLicense } = application.answers as {
          advancedLicense: keyof typeof advancedLicenseToSubLicenseMap
        }

        if (advancedLicense) {
          return m[`applicationForAdvancedLicenseApplyFor${advancedLicense}`]
        }

        return ''
      },
      children: [
        buildRadioField({
          id: 'advancedSubLicense',
          title: (application) => {
            const { advancedLicense } = application.answers as {
              advancedLicense: keyof typeof advancedLicenseToSubLicenseMap
            }

            if (advancedLicense) {
              const key =
                `applicationForAdvancedLicenseQuestion${advancedLicense}` as keyof typeof m

              if (Object.prototype.hasOwnProperty.call(m, key) && m?.[key]) {
                return m[key]
              }
            }

            return ''
          },
          width: 'half',
          doesNotRequireAnswer: false,
          required: true,
          options: (application) => {
            const { advancedLicense } = application.answers as {
              advancedLicense: keyof typeof advancedLicenseToSubLicenseMap
            }

            let value: string | undefined = ''

            if (advancedLicense) {
              value = advancedLicenseToSubLicenseMap[advancedLicense]
            }

            return [
              {
                value: value ?? '',
                label: 'Já',
              },
              {
                value: NO,
                label: 'Nei',
              },
            ]
          },
        }),
      ],
    }),
  ],
})
