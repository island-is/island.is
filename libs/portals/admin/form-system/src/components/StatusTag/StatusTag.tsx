import { Tag } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'

interface Props {
  status: string
}

export const StatusTag = ({ status }: Props) => {
  const { formatMessage } = useIntl()
  if (status === 'PUBLISHED') {
    return <Tag variant="mint">{formatMessage(m.published)}</Tag>
  }

  if (status === 'PUBLISHED_BEING_CHANGED') {
    return (
      <Tag variant="purple" truncate={true}>
        {formatMessage(m.publishedInProgress)}
      </Tag>
    )
  }

  if (status === 'IN_DEVELOPMENT') {
    return <Tag variant="blue">{formatMessage(m.inProgress)}</Tag>
  }

  return <Tag variant="red">Óþekkt</Tag>
}
