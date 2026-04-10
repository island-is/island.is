import { Outlet } from 'react-router-dom'

import { useLocale } from '@island.is/localization'

import { Layout } from '../../components/Layout/Layout'
import { m } from '../../lib/messages'
import { idsAdminControlsNav } from '../../lib/navigation'

const AdminControls = () => {
  const { formatMessage } = useLocale()

  return (
    <Layout
      navTitle={formatMessage(m.idsAdmin)}
      navItems={idsAdminControlsNav}
    >
      <Outlet />
    </Layout>
  )
}

export default AdminControls
