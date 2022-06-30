import {
  buildForm,
  buildCustomField,
  buildMultiField,
} from '@island.is/application/core'
import { ApplicationTypes, Form, FormModes } from '@island.is/application/types'
import { m } from './messages'

export const Finished: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  title: m.thankYouImageScreenTitle,
  mode: FormModes.APPROVED,
  children: [
    buildMultiField({
      id: 'finished',
      title: m.thankYouImageScreenTitle,
      description: m.thankYouImageScreenScreenSubTitle,
      children: [
        buildCustomField({
          id: 'thankYouImage',
          title: m.thankYouScreenTitle,
          component: 'WomanWithLaptopIllustrationPeriods',
        }),
      ],
    }),
  ],
})
