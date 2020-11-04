import {
  ApplicationTypes,
  buildForm,
  buildIntroductionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Finished: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  name: 'Umsókn lokið',
  mode: FormModes.APPROVED,
  children: [
    buildIntroductionField({
      id: 'finished',
      name: 'Takk',
      introduction:
        'Þú hefur nú fengið aðgang að umsjónarkerfi skajalveitenda. Það má finna á þínum síðum á ísland.is',
    }),
  ],
})
