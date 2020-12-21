import {
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Approved: Form = buildForm({
  id: 'ApprovedPassportApplication',
  name: 'Samþykkt',
  mode: FormModes.APPROVED,
  children: [
    buildDescriptionField({
      id: 'approved',
      name: 'Til hamingju!',
      description:
        'Umsókn þín um nýtt vegabréf hefur verið samþykkt! Það er mikið gleðiefni.',
    }),
  ],
})
