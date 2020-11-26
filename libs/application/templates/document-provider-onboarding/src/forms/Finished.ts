import {
  ApplicationTypes,
  buildForm,
  buildCustomField,
  buildMultiField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Finished: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  name: 'Umsókn lokið',
  mode: FormModes.APPROVED,
  children: [
    buildMultiField({
      id: 'finished',
      name: 'Aðgangur að raun',
      description:
        'Þú hefur nú fengið aðgang að umsjónarkerfi skajalveitenda. Það má finna á þínum síðum á ísland.is',
      children: [
        buildCustomField(
          {
            id: 'test',
            name: 'Takk fyrir',
            component: 'ThankYouImage',
          },
          {},
        ),
      ],
    }),
  ],
})
