import { Tag } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'

interface Props {
  status: string
  onClick?: () => void
  active?: boolean
}

export const StatusTag = ({ status, onClick, active }: Props) => {
  const { formatMessage } = useIntl()
  const interactiveProps = {
    onClick,
    'aria-pressed': onClick ? active : undefined,
  }

  if (status === 'PUBLISHED') {
    return (
      <Tag variant="mint" {...interactiveProps}>
        {formatMessage(m.published)}
      </Tag>
    )
  }

  if (status === 'PUBLISHED_BEING_CHANGED') {
    return (
      <Tag variant="purple" truncate={true} {...interactiveProps}>
        {formatMessage(m.publishedInProgress)}
      </Tag>
    )
  }

  if (status === 'IN_DEVELOPMENT') {
    return (
      <Tag variant="blue" {...interactiveProps}>
        {formatMessage(m.inProgress)}
      </Tag>
    )
  }

  return (
    <Tag variant="red" {...interactiveProps}>
      Óþekkt
    </Tag>
  )
}
