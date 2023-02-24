import { IntroHeader } from '@island.is/portals/core'
import TenantsList from '../components/TenantsList/TenantsList'
import { m } from '../lib/messages'
import { useLocale } from '@island.is/localization'

const IDSAdmin = () => {
  const { formatMessage } = useLocale()
  return (
    <div id="test-domainList">
      <IntroHeader
        title={formatMessage(m.idsAdmin)}
        intro={formatMessage(m.idsAdminDescription)}
      />
      <TenantsList />
    </div>
  )
}

export default IDSAdmin
