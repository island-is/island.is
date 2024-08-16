import {
  buildForm,
  buildMultiField,
  buildImageField,
} from '@island.is/application/core'
import { ApplicationTypes, Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { WomanWithLaptopIllustration } from '../assets/WomanWithLaptopIllustration'

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
        buildImageField({
          id: 'thankYouImage',
          title: m.thankYouScreenTitle,
          image: WomanWithLaptopIllustration,
          imageWidth: ['full', 'full', '50%', '50%'],
          imagePosition: 'center',
        }),
      ],
    }),
  ],
})
