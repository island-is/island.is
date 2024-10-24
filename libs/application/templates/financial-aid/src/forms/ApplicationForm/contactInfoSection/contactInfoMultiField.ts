import { buildMultiField, buildTextField } from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'

export const contactInfoMultiField = buildMultiField({
  id: Routes.CONTACTINFO,
  title: m.contactInfo.general.pageTitle,
  description: m.contactInfo.general.description,
  children: [
    buildTextField({
      id: `${Routes.CONTACTINFO}.email`,
      title: m.contactInfo.emailInput.label,
      placeholder: m.contactInfo.emailInput.placeholder,
    }),
    buildTextField({
      id: `${Routes.CONTACTINFO}.phone`,
      title: m.contactInfo.phoneInput.label,
      placeholder: '000-0000',
      format: '###-####',
    }),
  ],
})
