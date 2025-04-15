import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { freight } from '../../../lib/messages'

export const freightSection = buildSection({
  id: 'freightSection',
  title: freight.general.sectionTitle,
  children: [
    buildSubSection({
      id: 'freightCreateSubSection',
      title: freight.create.subSectionTitle,
      children: [
        buildMultiField({
          id: 'freightCreateMultiField',
          title: freight.create.pageTitle,
          children: [
            buildDescriptionField({
              id: 'description',
              title: 'TODOx lorem ipsum',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'freightPairingSubSection',
      title: freight.pairing.pageTitle,
      children: [
        buildMultiField({
          id: 'freightPairingMultiField',
          title: freight.pairing.pageTitle,
          children: [
            buildDescriptionField({
              id: 'description',
              title: 'TODOx lorem ipsum',
            }),
          ],
        }),
      ],
    }),
  ],
})
