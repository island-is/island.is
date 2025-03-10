import {
  buildDateField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { minDate, maxDate } from '../../../utils/dateUtils'

export const dateSubsection = buildSubSection({
  id: 'date',
  title: 'Date',
  children: [
    buildMultiField({
      id: 'dateMultiField',
      title: 'Date fields',
      children: [
        buildDateField({
          id: 'date',
          title: 'Regular datepicker',
        }),
        buildDateField({
          id: 'halfDate',
          title: 'Half datepicker',
          width: 'half',
        }),
        buildDateField({
          id: 'minAndMaxDate',
          title: 'Min and max dates datepicker',
          width: 'half',
          minDate: minDate,
          maxDate: maxDate,
        }),
        buildDateField({
          id: 'whiteDate',
          title: 'White datepicker (try to use blue if possible)',
          width: 'half',
          backgroundColor: 'white',
        }),
        buildDateField({
          id: 'placeholderDate',
          title: 'Placeholder datepicker',
          placeholder: 'Select a date',
          width: 'half',
        }),
        buildDateField({
          id: 'readOnlyDate',
          title: 'Readonly datepicker',
          width: 'half',
          readOnly: true,
          defaultValue: '2024-01-01',
        }),
      ],
    }),
  ],
})
