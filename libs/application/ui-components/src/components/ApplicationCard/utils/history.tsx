import React from 'react'
import { ApplicationStatus } from '@island.is/application/types'
import { AlertMessage, Box, Button } from '@island.is/island-ui/core'
import { FormatMessage } from '@island.is/localization'
import format from 'date-fns/format'
import { ApplicationCardFields, ApplicationCardHistoryItem } from '../types'
import { coreMessages } from '@island.is/application/core'

type HistoryDateFormats = {
  dateTimeFormat: string
  dateOnlyFormat: string
}

export const buildHistoryItems = (
  application: ApplicationCardFields,
  formatMessage: FormatMessage,
  dateFormats: HistoryDateFormats,
  openApplication?: () => void,
): ApplicationCardHistoryItem[] | undefined => {
  if (application.status === ApplicationStatus.DRAFT) return

  let historyItems: ApplicationCardHistoryItem[] = []

  const actionCardHistory = application.actionCard?.history
  const lastHistoryItem = actionCardHistory ? actionCardHistory[0] : undefined
  const lastHistoryDate = lastHistoryItem?.date
  if (application.actionCard?.pendingAction?.title) {
    const pendingRowComplete =
      application.status !== ApplicationStatus.IN_PROGRESS
    historyItems.push({
      // Without a history entry there is no real timestamp for this row, so we
      // fall back to today's date only rather than showing a made up time.
      date: lastHistoryDate
        ? format(new Date(lastHistoryDate), dateFormats.dateTimeFormat)
        : format(new Date(), dateFormats.dateOnlyFormat),
      title: formatMessage(application.actionCard.pendingAction.title ?? ''),
      isComplete: pendingRowComplete,
      content: application.actionCard.pendingAction.content ? (
        <AlertMessage
          type={application.actionCard?.pendingAction?.displayStatus}
          message={formatMessage(
            application.actionCard.pendingAction.content ?? '',
          )}
          action={
            openApplication !== undefined ? (
              <Box>
                <Button
                  variant="text"
                  size="small"
                  nowrap
                  onClick={openApplication}
                  icon="pencil"
                >
                  {application.actionCard.pendingAction.button
                    ? formatMessage(application.actionCard.pendingAction.button)
                    : formatMessage(coreMessages.cardButtonDraft)}
                </Button>
              </Box>
            ) : undefined
          }
        />
      ) : undefined,
    })
  }

  if (actionCardHistory) {
    historyItems = historyItems.concat(
      actionCardHistory.map((x) => ({
        date: format(new Date(x.date), dateFormats.dateTimeFormat),
        title: formatMessage(x.log),
        subjectAndActor: x.subLog,
        isComplete: true,
      })),
    )
  }

  return historyItems
}
