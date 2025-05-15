import {
  buildMultiField,
  buildSubSection,
  buildTextField,
  buildKeyValueField,
  buildDescriptionField,
  hasYes,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Operation } from '../../lib/constants'
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
          marginBottom: 'gutter',
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
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'outside.servingHours',
          title: m.openingHoursOutsideTitle,
          space: 'gutter',
          marginBottom: 'gutter',
          titleVariant: 'h3',
          condition: (answers) =>
            hasYes((answers.applicationInfo as Operation)?.willServe) || false,
        }),
        buildKeyValueField({
          label: '',
          value: m.weekdays,
          condition: (answers) =>
            hasYes((answers.applicationInfo as Operation)?.willServe) || false,
        }),
        buildTextField({
          id: 'openingHours.outside.weekdays.from',
          title: m.from,
          width: 'half',
          format: '##:##',
          placeholder: '00:00',
          condition: (answers) =>
            hasYes((answers.applicationInfo as Operation)?.willServe) || false,
        }),
        buildTextField({
          id: 'openingHours.outside.weekdays.to',
          title: m.to,
          width: 'half',
          format: '##:##',
          placeholder: '00:00',
          condition: (answers) =>
            hasYes((answers.applicationInfo as Operation)?.willServe) || false,
        }),
        buildKeyValueField({
          label: '',
          value: m.holidays,
          condition: (answers) =>
            hasYes((answers.applicationInfo as Operation)?.willServe) || false,
        }),
        buildTextField({
          id: 'openingHours.outside.weekends.from',
          title: m.from,
          width: 'half',
          format: '##:##',
          placeholder: '00:00',
          condition: (answers) =>
            hasYes((answers.applicationInfo as Operation)?.willServe) || false,
        }),
        buildTextField({
          id: 'openingHours.outside.weekends.to',
          title: m.to,
          width: 'half',
          format: '##:##',
          placeholder: '00:00',
          condition: (answers) =>
            hasYes((answers.applicationInfo as Operation)?.willServe) || false,
        }),
      ],
    }),
  ],
})
