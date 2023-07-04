import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { expeditedProcessing } from '../../../lib/messages'

export const ExpeditedProcessingSection = buildSection({
  id: 'expeditedProcessing',
  title: expeditedProcessing.general.sectionTitle,
  condition: (_, externalData) => {
    const isPermitTypeEmployment = getValueViaPath(
      externalData,
      'currentResidencePermit.data.isPermitTypeEmployment',
      false,
    ) as boolean

    return isPermitTypeEmployment
  },
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
