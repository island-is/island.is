import { useLocale } from '@island.is/localization'
import { Layout } from '@island.is/portals/admin/ids-admin'
import { m } from '../../lib/messages'
import { Outlet } from 'react-router-dom'
import { applicationSystemNavigation } from '../../lib/navigation'

export const Root = () => {
  const { formatMessage } = useLocale()

  return (
    <Layout
      navTitle={formatMessage(m.applicationSystem)}
      navItems={applicationSystemNavigation}
    >
      <Outlet />
    </Layout>
  )
}

export default Root
