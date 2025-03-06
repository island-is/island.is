import { FC } from 'react'
import { useIntl } from 'react-intl'

import DateLabel from './DateLabel'
import { rulingDateLabel as strings } from './RulingDateLabel.strings'

interface Props {
  rulingDate: string
}

const RulingDateLabel: FC<Props> = ({ rulingDate }) => {
  const { formatMessage } = useIntl()

  return <DateLabel text={formatMessage(strings.text)} date={rulingDate} />
}

export default RulingDateLabel
