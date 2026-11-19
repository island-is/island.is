import { getValueViaPath, SubSectionBuilder } from '@island.is/application/core'
import {
  minDate,
  maxDate,
  dateRangeFromMinDate,
  dateRangeToMaxDate,
} from '../../../utils/dateUtils'

export const dateSubsection = new SubSectionBuilder('date', 'Date')
  .addPage('dateMultiField', 'Date fields', (page) => {
    page
      .addDateField('date', 'Regular datepicker')
      .addDateField('halfDate', 'Half datepicker', {
        width: 'half',
      })
      .addDateField('minAndMaxDate', 'Min and max dates datepicker', {
        width: 'half',
        minDate: minDate,
        maxDate: maxDate,
      })
      .addDateField(
        'whiteDate',
        'White datepicker (try to use blue if possible)',
        {
          width: 'half',
          backgroundColor: 'white',
        },
      )
      .addDateField('placeholderDate', 'Placeholder datepicker', {
        placeholder: 'Select a date',
        width: 'half',
      })
      .addDateField('readOnlyDate', 'Readonly datepicker', {
        width: 'half',
        readOnly: true,
        defaultValue: '2024-01-01',
      })
      .addDescriptionField(
        'Common date picker pattern',
        'Common date picker pattern',
        {
          titleVariant: 'h3',
          description:
            'A common pattern for date pickers is to have to pick a date range with a starting date and an end date where end date can rely on the start date selected. ',
          marginTop: 2,
        },
      )
      .addDescriptionField('dateRangeFromDescription', '', {
        description:
          'The "From" date has a minDate three days ago and a maxDate three days from now. The "To" date is disabled if the "From" date is empty. When a "From" date is selected the "To" date field will be enabled and the maxDate will be seven days from the "From" date. Additionally the "To" field is cleared when the "From" field is changed to ensure that we will get a valid date range.',
      })
      .addDateField('dateRangeFrom', 'Date range from', {
        width: 'half',
        minDate: minDate,
        maxDate: maxDate,
        clearOnChange: ['dateRangeTo'],
      })
      .addDateField('dateRangeTo', 'Date range', {
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
      })
  })
  .build()
