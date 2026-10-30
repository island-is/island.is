import { useContext, useMemo } from 'react'

import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import { TrackedNotificationType } from '@island.is/judicial-system-web/src/graphql/schema'
import { hasSentNotification } from '@island.is/judicial-system-web/src/utils/utils'

const ArraignmentAlert = () => {
  const { workingCase } = useContext(FormContext)

  const courtDateNotification = useMemo(
    () =>
      hasSentNotification(
        TrackedNotificationType.COURT_DATE,
        workingCase.notifications,
      ),
    [workingCase.notifications],
  )

  const isConfirmed = courtDateNotification.hasSent

  return (
    <Box marginBottom={5}>
      <AlertMessage
        type={isConfirmed ? 'info' : 'warning'}
        title="Upplýsingar um fyrirtöku"
        message={
          <Box display="flex" flexDirection="column">
            <Text variant="small">
              {isConfirmed
                ? `Fyrirtökutími staðfestur ${formatDate(
                    courtDateNotification.date,
                    "dd.MM.yyyy 'kl.' HH:mm",
                  )}.`
                : 'Fyrirtökutími hefur ekki verið staðfestur'}
            </Text>
            {workingCase.comments && (
              <Text variant="small" marginTop={2}>
                <Text variant="small" as="span" fontWeight="semiBold">
                  Athugasemdir vegna málsmeðferðar:{' '}
                </Text>
                {workingCase.comments}
              </Text>
            )}
          </Box>
        }
      />
    </Box>
  )
}

export default ArraignmentAlert
