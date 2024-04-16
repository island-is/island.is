import { useLocale } from '@island.is/localization'
import { Layout } from '../../../../ids-admin/src/components/Layout/Layout'
import { Outlet } from 'react-router-dom'
import { m } from '../../lib/messages'
import { serviceDeskNavigation } from '../../lib/navigation'

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
