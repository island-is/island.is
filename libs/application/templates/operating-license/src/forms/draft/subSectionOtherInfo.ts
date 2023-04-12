import {
  buildMultiField,
  buildSubSection,
  buildTextField,
  buildCheckboxField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { NO, YES } from '../../lib/constants'

export const subSectionOtherInfo = buildSubSection({
  id: 'otherInfo',
  title: m.otherInfoTitle,
  children: [
    buildMultiField({
      id: 'otherInfo',
      title: m.otherInfoTitle,
      description: m.propertyInfoDescription,
      children: [
        buildCheckboxField({
          id: 'temporaryLicense',
          title: m.temporaryLicenseTitle,
          description: m.temporaryLicenseDescription,
          options: [{ value: YES, label: m.temporaryLicenseCheck }],
          defaultValue: [NO],
        }),
        buildCheckboxField({
          id: 'debtClaim',
          title: m.debtClaimTitle,
          options: [{ value: YES, label: m.debtClaimCheck }],
          defaultValue: [NO],
        }),
        buildTextField({
          id: 'otherInfoText',
          title: m.other,
          variant: 'textarea',
          doesNotRequireAnswer: true,
          placeholder: m.otherTextPlaceholder,
        }),
      ],
    }),
  ],
})
