import {
  Application,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  buildKeyValueField,
  buildCheckboxField,
} from '../../../../../core/src/lib/fieldBuilders'
import {
  APPLICATION_TYPES,
  OpeningHours,
  Operation,
  OPERATION_CATEGORY,
  YES,
} from '../../lib/constants'
import { hasYes } from '../../lib/utils'

export const subSectionOpeningHours = buildSubSection({
  id: 'openingHours',
  title: m.openingHoursTitle,
  condition: (answers) =>
    (answers.applicationInfo as Operation)?.operation ===
      APPLICATION_TYPES.RESTURANT ||
    (answers.applicationInfo as Operation)?.category?.includes(
      OPERATION_CATEGORY.TWO,
    ) ||
    false,
  children: [
    buildMultiField({
      id: 'openingHours',
      title: m.openingHoursTitle,
      description: m.propertyInfoDescription,
      children: [
        buildKeyValueField({
          label: m.openingHoursAlcohol,
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
        buildKeyValueField({
          label: '',
          value: m.holidays,
        }),
        buildTextField({
          id: 'openingHours.alcohol.holidays.from',
          title: m.from,
          width: 'half',
          format: '##:##',
          placeholder: '00:00',
        }),
        buildTextField({
          id: 'openingHours.alcohol.holidays.to',
          title: m.to,
          width: 'half',
          format: '##:##',
          placeholder: '00:00',
        }),
        buildCheckboxField({
          id: 'openingHours.willServe',
          title: m.openingHoursOutside,
          options: [{ value: YES, label: m.openingHoursOutsideCheck }],
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
          id: 'openingHours.outside.holidays.from',
          title: m.from,
          width: 'half',
          format: '##:##',
          placeholder: '00:00',
          condition: (answers) =>
            hasYes((answers.openingHours as OpeningHours)?.willServe) || false,
        }),
        buildTextField({
          id: 'openingHours.outside.holidays.to',
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
