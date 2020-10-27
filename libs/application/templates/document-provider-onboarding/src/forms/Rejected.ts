import {
  ApplicationTypes,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Rejected: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  name: 'Hafnað',
  mode: FormModes.REJECTED,
  children: [
    buildMultiField({
      id: 'general',
      name: '',
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
    }),
  ],
})
