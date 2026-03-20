import {
  buildAlertMessageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const endOfMonthCheck = buildSection({
  id: 'endOfMonthCheck',
  children: [
    buildMultiField({
      id: 'endOfMonthCheckMultiField',
      title: m.endOfMonth.multiTitle,
      children: [
        buildAlertMessageField({
          id: 'endOfMonthCheckAlertMessage',
          alertType: 'warning',
          message: m.endOfMonth.message,
        }),
      ],
    }),
  ],
})
