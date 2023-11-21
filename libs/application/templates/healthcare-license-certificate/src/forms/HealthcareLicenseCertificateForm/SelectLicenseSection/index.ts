import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const SelectLicenseSection = buildSection({
  id: 'selectLicenseSection',
  title: information.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'selectLicenseMultiField',
      title: 'test',
      children: [
        buildDescriptionField({
          id: 'test',
          title: 'test!',
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
