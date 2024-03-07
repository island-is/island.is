import {
  buildMultiField,
  buildPhoneField,
  buildSubSection,
  buildSubmitField,
  buildTextField,
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
