import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'

export const introSection = buildSection({
  id: 'introSection',
  title: 'Inngangur',
  children: [
    buildMultiField({
      id: 'intro',
      title: m.introTitle,
      children: [
        buildDescriptionField({
          id: 'introDescription',
          title: '',
          description: m.introDescription,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'introDescription2',
          title: '',
          description: m.introDescription2,
        }),
      ],
    }),
  ],
})
