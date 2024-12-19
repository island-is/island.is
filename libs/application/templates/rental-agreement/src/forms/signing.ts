import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Section } from '@island.is/application/types'
import { application } from '../lib/messages'

export const Signing: Section = buildSection({
  id: 'signing',
  title: application.signingSectionName,
  children: [
    buildMultiField({
      id: 'signing.info',
      title: 'Undirritun',
      description: 'Vinsamlegast undirritið samninginn',
      children: [
        buildDescriptionField({
          id: 'signing.description',
          title: 'Undirritun',
          description: 'Vinsamlegast undirritið samninginn',
        }),
      ],
    }),
  ],
})
