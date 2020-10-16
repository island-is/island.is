import {
  buildForm,
  buildIntroductionField,
  Form,
} from '@island.is/application/core'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
  name: 'Samþykkt',
  mode: 'approved',
  children: [
    buildIntroductionField({
      id: 'approved',
      name: 'Til hamingju!',
      introduction: 'Umsókn þín hefur verið samþykkt!',
    }),
  ],
})
