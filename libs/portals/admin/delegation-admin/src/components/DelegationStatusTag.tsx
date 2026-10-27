import { Tag } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../lib/messages'

export const DelegationStatusTag = ({ isActive }: { isActive: boolean }) => {
  const { formatMessage } = useLocale()

  return (
    <Tag variant={isActive ? 'mint' : 'red'} disabled>
      {formatMessage(isActive ? m.statusActive : m.statusExpired)}
    </Tag>
  )
}
