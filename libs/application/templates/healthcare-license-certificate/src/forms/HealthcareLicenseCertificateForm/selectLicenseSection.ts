import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { information } from '../../lib/messages'

export const SelectLicenseSection = buildSection({
  id: 'selectLicenseSection',
  title: information.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'selectLicence.multiField',
      title: 'test',
      children: [
        buildCustomField({
          id: 'selectLicence',
          component: 'SelectLicenseField',
          title: '',
        }),
      ],
    }),
  ],
})
