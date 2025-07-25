import { Tag } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { webMessages } from '../../../lib'

export const ApplicationCardTag = () => {
  const { formatMessage } = useIntl()
  const variant = 'blue'

  return (
    <Tag outlined={false} variant={variant} disabled>
      {formatMessage(webMessages.tagsDraft)}
    </Tag>
  )
}
