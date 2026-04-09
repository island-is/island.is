import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

import { m } from '../../lib/messages'

const ApiScopeUsers = () => {
  const { formatMessage } = useLocale()

  return <IntroHeader title={formatMessage(m.apiScopeUsers)} />
}

export default ApiScopeUsers
