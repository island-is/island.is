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
import { DefaultEvents } from '@island.is/application/types'

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
          setOnChange: async (optionValue, application) => {
            if (optionValue?.includes(YES)) {
              const applicantName =
                getValueViaPath<string>(
                  application.answers,
                  'applicant.name',
                ) ?? ''
              const applicantEmail =
                getValueViaPath<string>(
                  application.answers,
                  'applicant.email',
                ) ?? ''
              const applicantPhoneNumber =
                getValueViaPath<string>(
                  application.answers,
                  'applicant.phoneNumber',
                ) ?? ''

              return [
                {
                  key: `contactInformation.name`,
                  value: applicantName,
                },
                {
                  key: `contactInformation.phoneNumber`,
                  value: applicantPhoneNumber,
                },
                {
                  key: `contactInformation.email`,
                  value: applicantEmail,
                },
              ]
            }
            return [
              {
                key: `contactInformation.name`,
                value: '',
              },
              {
                key: `contactInformation.phoneNumber`,
                value: '',
              },
              {
                key: `contactInformation.email`,
                value: '',
              },
            ]
          },
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
          width: 'half',
          variant: 'text',
          required: true,
        }),
        buildPhoneField({
          id: 'contactInformation.phoneNumber',
          title: contactInformation.labels.phoneNumber,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'contactInformation.email',
          title: contactInformation.labels.email,
          width: 'half',
          variant: 'email',
          required: true,
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
