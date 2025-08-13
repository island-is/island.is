import {
  buildCheckboxField,
  buildMultiField,
  buildPhoneField,
  buildSubSection,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { contact } from '../../../lib/messages/contact'
import { isContactDifferentFromApplicant } from '../../../utils/isContactDifferentFromApplicant'

export const contactSubSection = buildSubSection({
  id: 'contactSubSection',
  title: contact.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'contact',
      title: contact.general.pageTitle,
      description: contact.general.description,
      children: [
        buildCheckboxField({
          id: 'contact.isSameAsApplicant',
          large: false,
          backgroundColor: 'white',
          options: [
            {
              label: contact.labels.contactSameAsUser,
              value: YES,
            },
          ],
          doesNotRequireAnswer: true,
          clearOnChange: [
            'contact.name',
            'contact.connection',
            'contact.email',
            'contact.phone',
          ],
        }),
        buildTextField({
          id: 'contact.name',
          title: contact.labels.name,
          required: true,
          variant: 'text',
          width: 'half',
          condition: isContactDifferentFromApplicant,
        }),
        buildTextField({
          id: 'contact.connection',
          title: contact.labels.connection,
          required: true,
          variant: 'text',
          width: 'half',
          condition: isContactDifferentFromApplicant,
        }),
        buildTextField({
          id: 'contact.email',
          title: contact.labels.email,
          variant: 'email',
          required: true,
          width: 'half',
          condition: isContactDifferentFromApplicant,
        }),
        buildPhoneField({
          id: 'contact.phone',
          title: contact.labels.phone,
          required: true,
          enableCountrySelector: true,
          width: 'half',
          condition: isContactDifferentFromApplicant,
        }),
      ],
    }),
  ],
})
