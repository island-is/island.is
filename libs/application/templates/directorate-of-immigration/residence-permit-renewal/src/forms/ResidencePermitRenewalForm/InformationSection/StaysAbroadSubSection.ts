import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const StaysAbroadSubSection = (index: number) =>
  buildSubSection({
    id: 'staysAbroad',
    title: information.labels.staysAbroad.subSectionTitle,
    children: [
      buildMultiField({
        id: 'staysAbroadMultiField',
        title: information.labels.staysAbroad.pageTitle,
        description: information.labels.staysAbroad.description,
        children: [
          buildDescriptionField({
            id: 'staysAbroad.title',
            title: information.labels.staysAbroad.title,
            titleVariant: 'h5',
          }),
        ],
      }),
    ],
  })
