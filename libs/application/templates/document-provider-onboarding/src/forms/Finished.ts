import {
  ApplicationTypes,
  buildForm,
  buildCustomField,
  buildMultiField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

export const Finished: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  name: m.thankYouImageScreenTitle,
  mode: FormModes.APPROVED,
  children: [
    buildMultiField({
      id: 'finished',
      name: m.thankYouImageScreenTitle,
      description: m.thankYouImageScreenScreenSubTitle,
      children: [
        buildCustomField(
          {
            id: 'ThankYouImage',
            name: 'Takk fyrir',
            component: 'ThankYouImage',
          },
          {},
        ),
      ],
    }),
  ],
})
