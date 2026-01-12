import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'

export const contactInfoSection = buildSection({
  id: Routes.CONTACTINFO,
  title: m.contactInfo.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'contactInfoMultiField',
      title: m.contactInfo.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'contactInfoDescription',
          description: m.contactInfo.general.description,
        }),
        buildTextField({
          id: `${Routes.CONTACTINFO}.email`,
          title: m.contactInfo.emailInput.label,
          placeholder: m.contactInfo.emailInput.placeholder,
        }),
        buildTextField({
          id: `${Routes.CONTACTINFO}.phone`,
          title: m.contactInfo.phoneInput.label,
          placeholder: m.contactInfo.phoneInput.placeholder,
          format: '###-####',
        }),
      ],
    }),
  ],
})
