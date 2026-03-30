import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'

export const ApplicantSubmitForm = buildForm({
  id: 'ApplicantSubmitForm',
  title: 'ApplicantSubmitForm',
  children: [
    buildSection({
      id: 'ApplicantSubmitFormSection',
      title: 'ApplicantSubmitFormSection',
      children: [
        buildMultiField({
          id: 'ApplicantSubmitFormMultiField',
          title: 'ApplicantSubmitFormMultiField',
          children: [
            buildDescriptionField({
              id: 'ApplicantSubmitFormDescription',
              title: 'ApplicantSubmitFormDescription',
            }),
          ],
        }),
        buildSubmitField({
          id: 'ApplicantSubmitFormSubmit',
          title: 'ApplicantSubmitFormSubmit',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'ApplicantSubmitFormSubmit',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
