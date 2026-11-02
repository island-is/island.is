import { Tag } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { DelegationStatus } from '../lib/delegationView'
import { m } from '../lib/messages'

const variants = {
  active: { variant: 'mint', message: m.statusActive },
  pending: { variant: 'blue', message: m.statusPending },
  expired: { variant: 'red', message: m.statusExpired },
} as const

export const DelegationStatusTag = ({
  status,
}: {
  status: DelegationStatus
}) => {
  const { formatMessage } = useLocale()
  const { variant, message } = variants[status]

  return (
    <Tag variant={variant} disabled>
      {formatMessage(message)}
    </Tag>
  )
}
