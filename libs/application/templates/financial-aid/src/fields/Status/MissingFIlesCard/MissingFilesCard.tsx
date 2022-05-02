import React from 'react'
import { useIntl } from 'react-intl'

import { Box, ActionCard } from '@island.is/island-ui/core'
import { missingFilesCard } from '../../../lib/messages'

const MissingFilesCard = () => {
  const { formatMessage } = useIntl()

  return (
    <Box marginBottom={[4, 4, 5]}>
      <ActionCard
        heading={formatMessage(missingFilesCard.title)}
        text={formatMessage(missingFilesCard.description)}
        // TODO: redirect user to page to upload files
        cta={{
          label: formatMessage(missingFilesCard.action),
          icon: undefined,
          onClick: () => {},
        }}
        backgroundColor="blue"
      />
    </Box>
  )
}

export default MissingFilesCard
