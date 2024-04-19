import { useLocale } from '@island.is/localization'
import { Outlet } from 'react-router-dom'
import { m } from '../../lib/messages'
import { serviceDeskNavigation } from '../../lib/navigation'
import { Layout } from '@island.is/portals/admin/ids-admin'

export const Root = () => {
  const { formatMessage } = useLocale()
  return (
    <Layout
      navTitle={formatMessage(m.serviceDesk)}
      navItems={serviceDeskNavigation}
    >
      <Outlet />
    </Layout>
  )
}

export default Root
