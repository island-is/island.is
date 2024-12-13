import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { externalData } from '../../lib/messages'

export const dataHandlingSection = buildSection({
  id: 'ExternalDataSection',
  title: externalData.agreementDescription.listTitle,
  children: [
    buildMultiField({
      title: externalData.agreementDescription.sectionTitle,
      id: 'agreementDescriptionMultiField',
      space: 2,
      children: [
        buildDescriptionField({
          id: 'agreementDescriptionDescriptionField',
          title: '',
          description: externalData.agreementDescription.bullets,
        }),
        buildDescriptionField({
          id: 'moreInformation',
          title: '',
          description: externalData.agreementDescription.moreInformation,
        }),
      ],
    }),
  ],
})
