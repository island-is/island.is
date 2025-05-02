import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const coOwnerSubSection = buildSubSection({
  id: 'coOwnerSubSection',
  title: information.labels.coOwner.sectionTitle,
  children: [
    buildMultiField({
      id: 'operatorMultiField',
      title: information.labels.coOwner.title,
      description: information.labels.coOwner.description,
      children: [
        buildCustomField({
          id: 'coOwners',
          component: 'CoOwnerRepeater',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
