import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Tag } from '@island.is/island-ui/core'
import { tables } from '@island.is/judicial-system-web/messages'

interface Props {
  isFine: boolean
}

const TagIndictmentRulingDecision: FC<Props> = (props) => {
  const { isFine } = props
  const { formatMessage } = useIntl()

  return (
    <Tag variant="darkerBlue" outlined disabled>
      {formatMessage(isFine ? tables.fineTag : tables.rulingTag)}
    </Tag>
  )
}

export default TagIndictmentRulingDecision
