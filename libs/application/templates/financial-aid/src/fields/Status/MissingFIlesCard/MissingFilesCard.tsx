import React from 'react'
import { useIntl } from 'react-intl'

import { Box, ActionCard } from '@island.is/island-ui/core'
import { status } from '../../../lib/messages'

const MissingFilesCard = () => {
  const { formatMessage } = useIntl()

  return (
    <Box marginBottom={[4, 4, 5]}>
      <ActionCard
        heading={formatMessage(status.missingFilesCard.title)}
        text={formatMessage(status.missingFilesCard.description)}
        cta={{
          label: formatMessage(status.missingFilesCard.action),
          icon: undefined,
          onClick: () => {},
        }}
        backgroundColor="blue"
      />
    </Box>
  )
}

export default MissingFilesCard
