import React from 'react'
import { ApplicationStatus } from '@island.is/application/types'
import { AlertMessage, Box, Button } from '@island.is/island-ui/core'
import { FormatMessage } from '@island.is/localization'
import format from 'date-fns/format'
import { ApplicationCardFields, ApplicationCardHistoryItem } from '../types'
import { coreMessages } from '@island.is/application/core'

export const buildHistoryItems = (
  application: ApplicationCardFields,
  formatMessage: FormatMessage,
  dateFormat: string,
  openApplication?: () => void,
): ApplicationCardHistoryItem[] | undefined => {
  if (application.status === ApplicationStatus.DRAFT) return

  let historyItems: ApplicationCardHistoryItem[] = []

  const actionCardHistory = application.actionCard?.history
  console.log('actionCardHistory', actionCardHistory)
  const lastHistoryItem = actionCardHistory ? actionCardHistory[0] : undefined
  const lastHistoryDate = lastHistoryItem?.date
  if (application.actionCard?.pendingAction?.title) {
    historyItems.push({
      date: format(
        lastHistoryDate ? new Date(lastHistoryDate) : new Date(),
        dateFormat,
      ),
      title: formatMessage(application.actionCard.pendingAction.title ?? ''),
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
        date: format(new Date(x.date), dateFormat),
        title: formatMessage(x.log),
        subTitle: x.subLog,
      })),
    )
  }

  return historyItems
}
