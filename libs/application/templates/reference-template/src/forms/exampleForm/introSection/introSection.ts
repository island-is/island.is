import {
  buildDescriptionField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'

export const introSection = buildSection({
  id: 'introSection',
  title: 'Inngangur',
  children: [
    buildDescriptionField({
      id: 'field',
      title: m.introField,
      description: (application) => ({
        ...m.introIntroduction,
        values: { name: application.answers.name },
      }),
    }),
  ],
})
