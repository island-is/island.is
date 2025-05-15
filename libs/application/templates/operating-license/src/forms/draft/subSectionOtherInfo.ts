import {
  buildMultiField,
  buildSubSection,
  buildTextField,
  buildCheckboxField,
  YES,
  NO,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

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
