import {
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { Routes } from '../../lib/constants'
import * as m from '../../lib/messages'

export const spouseContactInfoSection = buildSection({
  id: Routes.SPOUSECONTACTINFO,
  title: m.contactInfo.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.SPOUSECONTACTINFO,
      title: m.contactInfo.general.pageTitle,
      description: m.contactInfo.general.description,
      children: [
        buildTextField({
          id: `${Routes.SPOUSECONTACTINFO}.email`,
          title: m.contactInfo.emailInput.label,
          placeholder: m.contactInfo.emailInput.placeholder,
        }),
        buildTextField({
          id: `${Routes.SPOUSECONTACTINFO}.phone`,
          title: m.contactInfo.phoneInput.label,
          placeholder: '000-0000',
          format: '###-####',
        }),
      ],
    }),
  ],
})
