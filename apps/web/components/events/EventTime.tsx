import { Text } from '@island.is/island-ui/core'

interface EventTimeProps {
  startTime?: string
  endTime?: string
  timeSuffix?: string
}

export const EventTime = ({
  startTime,
  endTime,
  timeSuffix,
}: EventTimeProps) => {
  if (!startTime) return null

  return (
    <Text>
      {startTime as string} {endTime ? timeSuffix : ''} {endTime as string}
    </Text>
  )
}
