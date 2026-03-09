import {
  YES,
  buildCheckboxField,
  buildMultiField,
  buildPhoneField,
  buildSubSection,
  buildSubmitField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { contactInformation } from '../../../lib/messages'
import { Application, DefaultEvents } from '@island.is/application/types'
import { isContactDifferentFromApplicant } from '../../../utils'

export const contactInformationSubSection = buildSubSection({
  id: 'contactInformationSubSection',
  title: contactInformation.general.title,
  children: [
    buildMultiField({
      id: 'contactInformation',
      title: contactInformation.general.title,
      description: contactInformation.general.description,
      children: [
        buildCheckboxField({
          id: 'contactInformation.sameAsApplicant',
          large: false,
          backgroundColor: 'white',
          doesNotRequireAnswer: true,
          clearOnChange: [
            'contactInformation.name',
            'contactInformation.email',
            'contactInformation.phone',
          ],
          options: [
            {
              label: contactInformation.labels.isSameAsApplicant,
              value: YES,
            },
          ],
        }),
        buildTextField({
          id: 'contactInformation.name',
          title: contactInformation.labels.name,
          width: 'full',
          variant: 'text',
          required: true,
          condition: (formValue, _) =>
            isContactDifferentFromApplicant(formValue),
        }),
        buildPhoneField({
          id: 'contactInformation.phoneNumber',
          title: contactInformation.labels.phoneNumber,
          width: 'half',
          required: true,
          condition: (formValue, _) =>
            isContactDifferentFromApplicant(formValue),
        }),
        buildTextField({
          id: 'contactInformation.email',
          title: contactInformation.labels.email,
          width: 'half',
          variant: 'email',
          required: true,
          condition: (formValue, _) =>
            isContactDifferentFromApplicant(formValue),
        }),
        // Readonly fields
        buildTextField({
          id: 'contactReadonly.name',
          title: contactInformation.labels.name,
          readOnly: true,
          variant: 'text',
          width: 'full',
          condition: (formValue, _) =>
            !isContactDifferentFromApplicant(formValue),
          defaultValue: (application: Application) =>
            getValueViaPath<string>(application.answers, 'applicant.name'),
        }),
        buildPhoneField({
          id: 'contactReadonly.phone',
          title: contactInformation.labels.phoneNumber,
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
        buildTextField({
          id: 'contactReadonly.email',
          title: contactInformation.labels.email,
          variant: 'email',
          readOnly: true,
          width: 'half',
          condition: (formValue, _) =>
            !isContactDifferentFromApplicant(formValue),
          defaultValue: (application: Application) =>
            getValueViaPath<string>(application.answers, 'applicant.email'),
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: contactInformation.labels.approveButton,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: contactInformation.labels.approveButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
