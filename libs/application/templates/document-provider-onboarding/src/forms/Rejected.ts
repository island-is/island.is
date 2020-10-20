import {
  ApplicationTypes,
  buildForm,
  buildIntroductionField,
  buildTextField,
  Form,
} from '@island.is/application/core'

export const Rejected: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  ownerId: 'TODO?',
  name: 'Hafnað',
  mode: 'rejected',
  children: [
    buildIntroductionField({
      id: 'rejected',
      name: 'Því miður...',
      introduction:
        'Umsókn þinni hefur verið hafnað! Það er frekar leiðinlegt...',
    }),
    buildTextField({
      id: 'rejectionReason',
      name: 'Ástæða höfnunar',
      disabled: true,
    }),
  ],
})
