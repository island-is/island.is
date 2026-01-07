import {
  buildMultiField,
  buildSection,
  buildImageField,
} from '@island.is/application/core'
import { PersonsOnPhoneAndComputer } from '@island.is/application/assets/graphics'

import { application as applicationMessages } from '../../../lib/messages'
export const preInformation = buildSection({
  id: 'preInformation',
  title: applicationMessages.firstSectionStepperTitle,
  children: [
    buildMultiField({
      id: 'preInformation',
      title: applicationMessages.firstSectionTitle,
      description: applicationMessages.firstSectionDescription,
      children: [
        buildImageField({
          id: 'preInformationImage',
          image: PersonsOnPhoneAndComputer,
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
