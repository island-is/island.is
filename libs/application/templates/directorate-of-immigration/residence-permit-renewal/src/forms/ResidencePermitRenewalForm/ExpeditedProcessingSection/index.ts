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
  children: [
    buildMultiField({
      id: 'expeditedProcessingMultiField',
      title: expeditedProcessing.labels.pageTitle,
      description: expeditedProcessing.labels.description,
      condition: (_, externalData) => {
        //TODOx should check kids as well
        const canApplyPermanent = getValueViaPath(
          externalData,
          'currentResidencePermit.data.canApplyPermanent',
          false,
        ) as boolean

        return canApplyPermanent
      },
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
