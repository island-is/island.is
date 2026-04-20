import {
  buildCheckboxField,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { contactMessages } from '../../lib/messages'
import { isContactDifferentFromApplicant } from '../../utils/isContactDifferentFromApplicant'
import { isCompany } from '../../utils/isCompany'
import { Application } from '@island.is/application/types'

export const contactSection = buildSection({
  id: 'contactSection',
  title: contactMessages.title,
  children: [
    buildMultiField({
      id: 'contactMultiField',
      title: contactMessages.title,
      description: contactMessages.description,
      children: [
        buildCheckboxField({
          id: 'contact.isSameAsApplicant',
          large: false,
          backgroundColor: 'white',
          options: [
            {
              label: contactMessages.checkboxLabel,
              value: YES,
            },
          ],
          doesNotRequireAnswer: true,
          clearOnChange: ['contact.name', 'contact.email', 'contact.phone'],
          condition: (_, externalData) => !isCompany(externalData),
        }),
        buildTextField({
          id: 'contact.name',
          title: contactMessages.name,
          required: true,
          variant: 'text',
          width: 'full',
          condition: (formValue, externalData) =>
            isContactDifferentFromApplicant(formValue) ||
            isCompany(externalData),
        }),
        buildTextField({
          id: 'contact.email',
          title: contactMessages.email,
          variant: 'email',
          required: true,
          width: 'half',
          condition: (formValue, externalData) =>
            isContactDifferentFromApplicant(formValue) ||
            isCompany(externalData),
        }),
        buildPhoneField({
          id: 'contact.phone',
          title: contactMessages.phone,
          required: true,
          enableCountrySelector: true,
          width: 'half',
          condition: (formValue, externalData) =>
            isContactDifferentFromApplicant(formValue) ||
            isCompany(externalData),
        }),

        // Readonly fields
        buildTextField({
          id: 'contactReadonly.name',
          title: contactMessages.name,
          readOnly: true,
          variant: 'text',
          width: 'full',
          condition: (formValue, _) =>
            !isContactDifferentFromApplicant(formValue),
          defaultValue: (application: Application) =>
            getValueViaPath<string>(application.answers, 'applicant.name'),
        }),
        buildTextField({
          id: 'contactReadonly.email',
          title: contactMessages.email,
          variant: 'email',
          readOnly: true,
          width: 'half',
          condition: (formValue, _) =>
            !isContactDifferentFromApplicant(formValue),
          defaultValue: (application: Application) =>
            getValueViaPath<string>(application.answers, 'applicant.email'),
        }),
        buildPhoneField({
          id: 'contactReadonly.phone',
          title: contactMessages.phone,
          enableCountrySelector: true,
          readOnly: true,
          width: 'half',
          condition: (formValue, _) =>
            !isContactDifferentFromApplicant(formValue),
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.answers,
              'applicant.phoneNumber',
            ),
        }),
      ],
    }),
  ],
})
