import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import type { ScopeSelection } from '../../context/DelegationFormContext'
import { m } from '../../lib/messages'
import { RecipientsTag } from '../RecipientsTag'
import { ScopesTable } from '../ScopesTable/ScopesTable'

type DeleteWarningStepProps = {
  initialScopes: ScopeSelection[]
}

export const DeleteWarningStep = ({
  initialScopes,
}: DeleteWarningStepProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box display="flex" flexDirection="column" alignItems="flexStart">
      <Text variant="h3" marginBottom={2}>
        {formatMessage(m.deleteWarningTitle)}
      </Text>
      <RecipientsTag />
      <Box marginBottom={4} width="full">
        <AlertMessage
          type="warning"
          message={formatMessage(m.deleteWarningBody)}
        />
      </Box>
      <Box width="full">
        <ScopesTable scopes={initialScopes} showDate editableDates={false} />
      </Box>
    </Box>
  )
}
