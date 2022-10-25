import {
  buildMultiField,
  buildSubSection,
  buildTextField,
  buildKeyValueField,
  buildCheckboxField,
  buildDescriptionField,
  hasYes,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { NO, OpeningHours, YES } from '../../lib/constants'
import { displayOpeningHours } from '../../lib/utils'

export const subSectionOpeningHours = buildSubSection({
  id: 'openingHours',
  title: m.openingHoursTitle,
  condition: (answers) => displayOpeningHours(answers),
  children: [
    buildMultiField({
      id: 'openingHours',
      title: m.openingHoursTitle,
      description: m.propertyInfoDescription,
      children: [
        buildDescriptionField({
          id: 'alcohol.servingHours',
          title: m.openingHoursAlcohol,
          space: 'gutter',
          titleVariant: 'h3',
        }),
        buildDescriptionField({
          id: 'overview.space',
          title: '',
          description: '',
          space: 'gutter',
        }),
        buildKeyValueField({
          label: '',
          value: m.weekdays,
        }),

        buildTextField({
          id: 'openingHours.alcohol.weekdays.from',
          title: m.from,
          width: 'half',
          format: '##:##',
          placeholder: '00:00',
        }),
        buildTextField({
          id: 'openingHours.alcohol.weekdays.to',
          title: m.to,
          width: 'half',
          format: '##:##',
          placeholder: '00:00',
        }),
        buildDescriptionField({
          id: 'overview.space1',
          title: '',
          description: '',
          space: 'gutter',
        }),
        buildKeyValueField({
          label: '',
          value: m.holidays,
        }),
        buildTextField({
          id: 'openingHours.alcohol.weekends.from',
          title: m.from,
          width: 'half',
          format: '##:##',
          placeholder: '00:00',
        }),
        buildTextField({
          id: 'openingHours.alcohol.weekends.to',
          title: m.to,
          width: 'half',
          format: '##:##',
          placeholder: '00:00',
        }),
        buildDescriptionField({
          id: 'overview.space2',
          title: '',
          description: '',
          space: 'gutter',
        }),
        buildCheckboxField({
          id: 'openingHours.willServe',
          title: m.openingHoursOutside,
          options: [{ value: YES, label: m.openingHoursOutsideCheck }],
          defaultValue: [NO],
        }),
        buildDescriptionField({
          id: 'outside.servingHours',
          title: m.openingHoursOutsideTitle,
          space: 'gutter',
          titleVariant: 'h3',
          condition: (answers) =>
            hasYes((answers.openingHours as OpeningHours)?.willServe) || false,
        }),
        buildDescriptionField({
          id: 'overview.space3',
          title: '',
          description: '',
          space: 'gutter',
          condition: (answers) =>
            hasYes((answers.openingHours as OpeningHours)?.willServe) || false,
        }),
        buildKeyValueField({
          label: '',
          value: m.weekdays,
          condition: (answers) =>
            hasYes((answers.openingHours as OpeningHours)?.willServe) || false,
        }),
        buildTextField({
          id: 'openingHours.outside.weekdays.from',
          title: m.from,
          width: 'half',
          format: '##:##',
          placeholder: '00:00',
          condition: (answers) =>
            hasYes((answers.openingHours as OpeningHours)?.willServe) || false,
        }),
        buildTextField({
          id: 'openingHours.outside.weekdays.to',
          title: m.to,
          width: 'half',
          format: '##:##',
          placeholder: '00:00',
          condition: (answers) =>
            hasYes((answers.openingHours as OpeningHours)?.willServe) || false,
        }),
        buildKeyValueField({
          label: '',
          value: m.holidays,
          condition: (answers) =>
            hasYes((answers.openingHours as OpeningHours)?.willServe) || false,
        }),
        buildTextField({
          id: 'openingHours.outside.weekends.from',
          title: m.from,
          width: 'half',
          format: '##:##',
          placeholder: '00:00',
          condition: (answers) =>
            hasYes((answers.openingHours as OpeningHours)?.willServe) || false,
        }),
        buildTextField({
          id: 'openingHours.outside.weekends.to',
          title: m.to,
          width: 'half',
          format: '##:##',
          placeholder: '00:00',
          condition: (answers) =>
            hasYes((answers.openingHours as OpeningHours)?.willServe) || false,
        }),
      ],
    }),
  ],
})
