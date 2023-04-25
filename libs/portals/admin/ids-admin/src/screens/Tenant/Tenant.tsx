import { Outlet } from 'react-router-dom'
import { domainNav } from '../../lib/navigation'
import Layout from '../../components/Layout/Layout'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

const Tenant = () => {
  const { formatMessage } = useLocale()
  return (
    <Layout navTitle={formatMessage(m.idsAdmin)} navItems={domainNav}>
      <Outlet />
    </Layout>
  )
}

export default Tenant
