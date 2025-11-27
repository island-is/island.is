import { Tag } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { FormStatus } from '@island.is/form-system/shared'

interface Props {
  status: string
}

export const StatusTag = ({ status }: Props) => {
  if (status === 'PUBLISHED') {
    return <Tag variant="mint">Útgefið</Tag>
  }

  if (status === 'PUBLISHED_BEING_CHANGED') {
    return <Tag variant="purple">Útgefið í vinnslu</Tag>
  }

  if (status === 'IN_DEVELOPMENT') {
    return <Tag variant="blue">Í vinnslu</Tag>
  }

  if (status === 'ARCHIVED') {
    return <Tag variant="red">Afskráð</Tag>
  }

  return <Tag variant="red">Óþekkt</Tag>
}
