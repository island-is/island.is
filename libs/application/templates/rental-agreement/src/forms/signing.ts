import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Section } from '@island.is/application/types'

export const Signing: Section = buildSection({
  id: 'signing',
  title: 'Undirritun',
  children: [
    buildMultiField({
      id: 'signingInfo',
      title: 'Undirritun',
      description: 'Vinsamlegast undirritið samninginn',
      children: [
        buildDescriptionField({
          id: 'signingDescription',
          title: 'Undirritun',
          description: 'Vinsamlegast undirritið samninginn',
        }),
      ],
    }),
  ],
})
