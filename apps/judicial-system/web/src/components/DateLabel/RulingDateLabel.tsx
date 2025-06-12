import { FC } from 'react'
import { useIntl } from 'react-intl'

import DateLabel from './DateLabel'
import { rulingDateLabel as strings } from './RulingDateLabel.strings'

interface Props {
  rulingDate: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p'
}

const RulingDateLabel: FC<Props> = ({ rulingDate, as }) => {
  const { formatMessage } = useIntl()

  return (
    <DateLabel text={formatMessage(strings.text)} date={rulingDate} as={as} />
  )
}

export default RulingDateLabel
