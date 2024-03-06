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
  id: 'contactInformation',
  title: contactInformation.general.title,
  children: [
    buildMultiField({
      id: 'contactInformationMultiField',
      title: contactInformation.general.title,
      description: contactInformation.general.description,
      children: [
        buildTextField({
          id: 'name',
          title: contactInformation.labels.name,
          width: 'half',
          variant: 'text',
          required: true,
        }),
        buildPhoneField({
          id: 'phoneNumber',
          title: contactInformation.labels.phoneNumber,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'email',
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
