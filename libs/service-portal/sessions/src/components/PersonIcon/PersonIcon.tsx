import React, { FC } from 'react'
import { Box, Icon } from '@island.is/island-ui/core'
import { SessionType } from '../../lib/types/sessionTypes'

interface IProps {
  sessionType: SessionType
}

const PersonIcon: FC<IProps> = ({ sessionType = SessionType.self }) => {
  const textColor =
    sessionType === SessionType.onBehalf ? 'blue400' : 'purple400'
  if (sessionType === SessionType.self || sessionType === SessionType.company) {
    return null
  }
  return (
    <Box
      display="flex"
      style={{ width: 'fit-content' }}
      background={'blue100'}
      borderRadius="large"
      padding={1}
    >
      <Icon size="small" icon="person" type="outline" color={textColor} />
      <Icon
        size="small"
        icon={
          sessionType === SessionType.onBehalf ? 'arrowForward' : 'arrowBack'
        }
        type="outline"
        color={textColor}
      />
    </Box>
  )
}

export default PersonIcon
