import {
  Application,
  buildMultiField,
  buildSubSection,
  buildTextField,
  buildCheckboxField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { YES } from '../../lib/constants'

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
          options: [{ value: YES, label: m.temporaryLicenseCheck }],
        }),
        buildCheckboxField({
          id: 'debtClaim',
          title: m.debtClaimTitle,
          options: [{ value: YES, label: m.debtClaimCheck }],
        }),
        buildTextField({
          id: 'otherInfoText',
          title: 'Annað',
          variant: 'textarea',
        }),
      ],
    }),
  ],
})
