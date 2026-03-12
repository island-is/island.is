import {
  buildAlertMessageField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { formatDayRateApiErrorMessages } from '../../utils/errorFormatUtils'

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
            const carsToChangeCount = getValueViaPath<number>(
              application.answers,
              'carsToChangeCount',
            )
            const vehicleLatestMilageRows =
              getValueViaPath<Array<unknown>>(
                application.answers,
                'vehicleLatestMilageRows',
              ) ?? []
            const countToDisplay =
              carsToChangeCount ?? vehicleLatestMilageRows.length

            return [[countToDisplay.toString()]]
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
          formatLongErrorMessage: formatDayRateApiErrorMessages,
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
