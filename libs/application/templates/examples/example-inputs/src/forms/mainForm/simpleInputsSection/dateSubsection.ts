import {
  buildDateField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import {
  minDate,
  maxDate,
  dateRangeFromMinDate,
  dateRangeToMaxDate,
} from '../../../utils/dateUtils'

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
        buildDescriptionField({
          id: 'Common date picker pattern',
          title: 'Common date picker pattern',
          titleVariant: 'h3',
          description:
            'A common pattern for date pickers is to have to pick a date range with a starting date and an end date where end date can rely on the start date selected. ',
          marginTop: 2,
        }),
        buildDescriptionField({
          id: 'dateRangeFromDescription',
          description:
            'The "From" date has a minDate three days ago and a maxDate three days from now. The "To" date is disabled if the "From" date is empty. When a "From" date is selected the "To" date field will be enabled and the maxDate will be seven days from the "From" date. Additionally the "To" field is cleared when the "From" field is changed to ensure that we will get a valid date range.',
        }),
        buildDateField({
          id: 'dateRangeFrom',
          title: 'Date range from',
          width: 'half',
          minDate: minDate,
          maxDate: maxDate,
          clearOnChange: ['dateRangeTo'],
        }),
        buildDateField({
          id: 'dateRangeTo',
          title: 'Date range',
          width: 'half',
          minDate: dateRangeFromMinDate,
          maxDate: dateRangeToMaxDate,
          tempDisabled: (application) => {
            const dateFrom = getValueViaPath<string>(
              application.answers,
              'dateRangeFrom',
            )
            return dateFrom && dateFrom !== '' ? false : true
          },
        }),
      ],
    }),
  ],
})
