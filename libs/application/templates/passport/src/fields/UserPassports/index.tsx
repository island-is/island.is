import React from 'react'
import { ActionCard, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const UserPassports = () => {
  const { formatMessage } = useLocale()

  return (
    <Box style={{ fontSize: 14, fontWeight: 300 }}>
      <ActionCard
        cta={{
          label: '',
          variant: undefined,
          size: undefined,
          icon: undefined,
          onClick: undefined,
          disabled: undefined,
        }}
      />
    </Box>
  )
}
