import { useContext, useMemo } from 'react'

import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import { NotificationType } from '@island.is/judicial-system-web/src/graphql/schema'
import { hasSentNotification } from '@island.is/judicial-system-web/src/utils/utils'

const ArraignmentAlert = () => {
  const { workingCase } = useContext(FormContext)

  const courtDateNotification = useMemo(
    () =>
      hasSentNotification(
        NotificationType.COURT_DATE,
        workingCase.notifications,
      ),
    [workingCase.notifications],
  )

  return (
    <Box marginBottom={5}>
      <AlertMessage
        type="info"
        title="Upplýsingar um fyrirtöku"
        message={
          <Box display="flex" flexDirection="column">
            <Text variant="small">
              {courtDateNotification.hasSent
                ? `Síðasta tilkynnning var send ${formatDate(
                    courtDateNotification.date,
                    'PPPp',
                  )}.`
                : 'Tilkynning um fyrirtökutíma hefur ekki verið send.'}
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
