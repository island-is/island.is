import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const changesSection = buildSection({
  id: 'appraisalMethodSection',
  title: m.changesMessages.title,
  children: [
    buildMultiField({
      id: 'appraisalMethod',
      title: m.changesMessages.title,
      description: m.changesMessages.description,
      children: [
        buildCheckboxField({
          id: 'appraisalMethod',
          title: m.changesMessages.appraisalMethod,
          width: 'half',
          options: [
            {
              label: m.changesMessages.becauseOfRenovations,
              value: 'renovations',
            },
            {
              label: m.changesMessages.becauseOfAdditions,
              value: 'additions',
            },
          ],
        }),
        buildDescriptionField({
          id: 'descriptionDescription',
          title: m.changesMessages.descriptionOfChanges,
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'description',
          placeholder: m.changesMessages.textAreaPlaceholder,
          variant: 'textarea',
          rows: 14,
        }),
      ],
    }),
  ],
})
