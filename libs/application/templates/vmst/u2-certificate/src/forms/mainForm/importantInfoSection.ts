import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  YES,
} from '@island.is/application/core'
import { mainForm as m } from '../../lib/messages'

export const importantInfoSection = buildSection({
  id: 'importantInfoSection',
  title: m.importantInfoSection.sectionTitle,
  children: [
    buildMultiField({
      id: 'importantInfoSectionMulti',
      title: m.importantInfoSection.title,
      children: [
        buildDescriptionField({
          id: 'importantInfoDescriptionField',
          description: m.importantInfoSection.description,
        }),
        buildCheckboxField({
          id: 'infoCheckbox',
          marginTop: 4,
          options: [
            { value: YES, label: m.importantInfoSection.checkboxLabel },
          ],
        }),
      ],
    }),
  ],
})
