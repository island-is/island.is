import { Text } from '@island.is/island-ui/core'

interface EventTimeProps {
  startTime?: string
  endTime?: string
  startDate?: string
  endDate?: string
  timePrefix?: string
  timeSuffix?: string
}

export const EventTime = ({
  startTime,
  endTime,
  endDate,
  timePrefix,
  timeSuffix,
}: EventTimeProps) => {
  if (!startTime) return null

  return (
    <Text>
      {timePrefix ? `${timePrefix} ` : ''}
      {startTime as string} {endTime ? timeSuffix : ''} {endTime as string}
    </Text>
  )
}
