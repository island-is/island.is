import {
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Done: Form = buildForm({
  id: 'ApprovedPassportApplication',
  title: 'Samþykkt',
  mode: FormModes.APPROVED,
  children: [
    buildDescriptionField({
      id: 'approved',
      title: 'Til hamingju!',
      description:
        'Umsókn þín um nýtt vegabréf hefur verið samþykkt! Það er mikið gleðiefni.',
    }),
  ],
})
