import {
  buildDateField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { buildAlertMessageField } from '@island.is/application/core'
import { ApplicantType } from '../../shared/constants'

import * as m from '../../lib/messages'
import { dateFromMinDate, dateToMaxDate, dateToMinDate } from '../../utils'

export const dateSection = buildSection({
  id: 'dateSection',
  title: m.application.date.sectionTitle,
  children: [
    buildMultiField({
      id: 'dateMultifield',
      title: m.application.date.sectionDescription,
      children: [
        buildAlertMessageField({
          condition: (answers) =>
            answers.studentOrTouristRadioFieldTourist === ApplicantType.TOURIST,
          id: 'dateTouristAlertMessage',
          alertType: 'info',
          title: m.application.date.dateAlertTitle,
          message: m.application.date.touristAlertMessage,
        }),
        buildAlertMessageField({
          condition: (answers) =>
            answers.studentOrTouristRadioFieldTourist === ApplicantType.STUDENT,
          id: 'dateVacationAlertMessage',
          alertType: 'info',
          title: m.application.date.dateAlertTitle,
          message: m.application.date.studentAlertMessage,
        }),
        buildDateField({
          id: 'period.dateFieldFrom',
          minDate: dateFromMinDate,
          title: m.application.date.dateFromTitle,
          placeholder: m.application.date.datePlaceholderText,
          required: true,
          clearOnChange: ['period.dateFieldTo'],
          width: 'half',
          defaultValue: '',
        }),
        buildDateField({
          id: 'period.dateFieldTo',
          minDate: dateToMinDate,
          maxDate: dateToMaxDate,
          title: m.application.date.dateToTitle,
          placeholder: m.application.date.datePlaceholderText,
          required: true,
          width: 'half',
          defaultValue: '',
          tempDisabled: (application) => {
            const dateFrom = getValueViaPath<string>(
              application.answers,
              'period.dateFieldFrom',
            )
            return dateFrom && dateFrom !== '' ? false : true
          },
        }),
      ],
    }),
  ],
})
