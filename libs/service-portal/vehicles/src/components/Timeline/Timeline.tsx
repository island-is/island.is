import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import { Box } from '@island.is/island-ui/core'

interface Props {
  children?: Array<React.ReactNode>
}
const Timeline: FC<Props> = ({ children = [] }) => {
  return <Box paddingY={2}></Box>
}

export default Timeline
