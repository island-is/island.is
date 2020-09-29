import {
  ApplicationTypes,
  buildForm,
  buildIntroductionField,
  Form,
} from '@island.is/application/template'

export const Approved: Form = buildForm({
  id: ApplicationTypes.EXAMPLE,
  ownerId: 'TODO?',
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
