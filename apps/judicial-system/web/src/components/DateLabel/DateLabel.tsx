import { FC } from 'react'

import { Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'

interface Props {
  date: string | Date
  text?: string
  hideTime?: boolean
}

const DateLabel: FC<Props> = ({ date, text, hideTime }) => {
  const formattedDate = formatDate(date, 'PPP')
  const formattedTime = `kl. ${formatDate(date, constants.TIME_FORMAT)}`

  return (
    <Text as="h5" variant="h5">
      {`${text ?? ''} ${formattedDate} ${!hideTime ? formattedTime : ''}`}
    </Text>
  )
}

export default DateLabel
