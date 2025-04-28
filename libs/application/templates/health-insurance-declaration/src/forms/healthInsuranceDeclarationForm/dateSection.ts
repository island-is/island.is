import {
  buildDateField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { buildAlertMessageField } from '@island.is/application/core'
import { ApplicantType } from '../../shared/constants'
import sub from 'date-fns/sub'
import * as m from '../../lib/messages'

export const dateSection = buildSection({
  id: 'dateSection',
  title: m.application.date.sectionTitle,
  children: [
    buildMultiField({
      id: 'dateMultifield',
      title: m.application.date.sectionDescription,
      children: [
        buildDateField({
          id: 'period.dateFieldFrom',
          minDate: (application) =>
            application.answers.studentOrTouristRadioFieldTourist ===
            ApplicantType.STUDENT
              ? sub(new Date(), { years: 1 })
              : new Date(0),
          title: m.application.date.dateFromTitle,
          placeholder: m.application.date.datePlaceholderText,
          required: true,
          width: 'half',
          defaultValue: '',
        }),
        buildDateField({
          id: 'period.dateFieldTo',
          title: m.application.date.dateToTitle,
          placeholder: m.application.date.datePlaceholderText,
          required: true,
          width: 'half',
          defaultValue: '',
        }),
        buildAlertMessageField({
          id: 'dateAlertMessage',
          alertType: 'warning',
          title: m.application.date.studentMinDateWarningTitle,
          message: m.application.date.studentMinDateWarning,
          condition: (answers) =>
            answers.studentOrTouristRadioFieldTourist === ApplicantType.STUDENT,
        }),
      ],
    }),
  ],
})
