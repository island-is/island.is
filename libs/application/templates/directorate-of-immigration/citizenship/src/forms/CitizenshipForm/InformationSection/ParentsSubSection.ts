import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const ParentsSubSection = buildSubSection({
  id: 'parents',
  title: information.labels.parents.subSectionTitle,
  children: [
    buildMultiField({
      id: 'parentsMultiField',
      title: information.labels.parents.pageTitle,
      description: information.labels.parents.description,
      children: [
        buildDescriptionField({
          id: 'parents.title',
          title: information.labels.parents.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
