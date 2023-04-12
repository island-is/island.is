import React, { useEffect, useState } from 'react'
import { Box, Text } from '@island.is/island-ui/core'

import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

const Overview = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Text> {formatMessage(m.petitions)}</Text>
    </Box>
  )
}

export default Overview
