import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { personal } from '../../../lib/messages'

export const PickChildrenSubSection = buildSubSection({
  id: 'pickChildren',
  title: personal.labels.pickChildren.subSectionTitle,
  children: [
    buildMultiField({
      id: 'pickChildrenMultiField',
      title: personal.labels.pickChildren.pageTitle,
      description: personal.labels.pickChildren.description,
      children: [
        buildDescriptionField({
          id: 'pickChildren.title',
          title: personal.labels.pickChildren.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
