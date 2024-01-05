import React, { FC } from 'react'
import { Box, Icon, Tooltip } from '@island.is/island-ui/core'
import { SessionType } from '../../lib/types/sessionTypes'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

interface IProps {
  sessionType: SessionType
}

const PersonIcon: FC<React.PropsWithChildren<IProps>> = ({
  sessionType = SessionType.self,
}) => {
  const { formatMessage } = useLocale()
  const textColor =
    sessionType === SessionType.onBehalf ? 'blue400' : 'purple400'
  if (sessionType === SessionType.self || sessionType === SessionType.company) {
    return null
  }

  const text =
    sessionType === SessionType.onBehalf
      ? formatMessage(m.onBehalfOF)
      : formatMessage(m.inYourBehalf)

  return (
    <Tooltip placement={'bottom'} text={text}>
      <Box
        display="flex"
        style={{ width: 'fit-content' }}
        background={
          sessionType === SessionType.onBehalf ? 'blue100' : 'purple100'
        }
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
    </Tooltip>
  )
}

export default PersonIcon
