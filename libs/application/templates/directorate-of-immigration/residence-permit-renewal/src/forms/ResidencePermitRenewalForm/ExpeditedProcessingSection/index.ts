import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { expeditedProcessing } from '../../../lib/messages'

export const ExpeditedProcessingSection = buildSection({
  id: 'expeditedProcessing',
  title: expeditedProcessing.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'expeditedProcessingMultiField',
      title: expeditedProcessing.labels.pageTitle,
      description: expeditedProcessing.labels.description,
      children: [
        buildDescriptionField({
          id: 'expeditedProcessing.title',
          title: expeditedProcessing.labels.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
