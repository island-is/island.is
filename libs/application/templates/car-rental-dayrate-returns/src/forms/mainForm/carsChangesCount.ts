import {
  buildAlertMessageField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { formatDayRateReturnsApiErrorMessages } from '../../utils/errorFormatUtils'

export const carsChangesCountSection = buildSection({
  id: 'carsChangesCountSection',
  title: m.carsChangesCount.sectionTitle,
  children: [
    buildMultiField({
      id: 'carsChangesCountMultiField',
      title: m.carsChangesCount.multiTitle,
      children: [
        buildStaticTableField({
          header: [m.carsChangesCount.header],
          rows: (application) => {
            const data =
              getValueViaPath<number>(
                application.answers,
                'carDayRateUsageCount',
              ) ?? 0

            return [[data.toString()]]
          },
        }),
        buildAlertMessageField({
          id: 'carsChangesCountAlertMessage',
          alertType: 'info',
          message: m.carsChangesCount.alertMessage,
        }),
        buildSubmitField({
          id: 'submit',
          refetchApplicationAfterSubmit: true,
          renderLongErrors: true,
          formatLongErrorMessage: formatDayRateReturnsApiErrorMessages,
          actions: [
            {
              event: 'SUBMIT',
              name: m.carsChangesCount.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
