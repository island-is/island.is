import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

import { m } from '../../lib/messages'

const GrantTypes = () => {
  const { formatMessage } = useLocale()

  return <IntroHeader title={formatMessage(m.grantTypes)} />
}

export default GrantTypes
