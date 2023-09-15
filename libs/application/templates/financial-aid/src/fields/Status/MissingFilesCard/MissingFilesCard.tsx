import React from 'react'
import { useIntl } from 'react-intl'

import { Box, ActionCard } from '@island.is/island-ui/core'
import { missingFilesCard } from '../../../lib/messages'
import { Routes } from '../../../lib/constants'

interface Props {
  goToScreen?: (id: string) => void
}

const MissingFilesCard = ({ goToScreen }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <Box marginBottom={[4, 4, 5]}>
      <ActionCard
        heading={formatMessage(missingFilesCard.title)}
        text={formatMessage(missingFilesCard.description)}
        cta={{
          label: formatMessage(missingFilesCard.action),
          icon: undefined,
          onClick: () => goToScreen?.(Routes.MISSINGFILES),
        }}
        backgroundColor="blue"
      />
    </Box>
  )
}

export default MissingFilesCard
