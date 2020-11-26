import {
  buildForm,
  buildIntroductionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Approved: Form = buildForm({
  id: 'ApprovedPassportApplication',
  name: 'Samþykkt',
  mode: FormModes.APPROVED,
  children: [
    buildIntroductionField({
      id: 'approved',
      name: 'Til hamingju!',
      introduction:
        'Umsókn þín um nýtt vegabréf hefur verið samþykkt! Það er mikið gleðiefni.',
    }),
  ],
})
