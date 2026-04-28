import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

import { m } from '../../lib/messages'

const IdpProviders = () => {
  const { formatMessage } = useLocale()

  return <IntroHeader title={formatMessage(m.idpProviders)} />
}

export default IdpProviders
