import { Outlet, useRouteLoaderData } from 'react-router-dom'
import { idsAdminNav } from '../../lib/navigation'
import { Layout } from '../../components/Layout/Layout'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useEffect, useState } from 'react'
import { tenantLoaderId } from './Tenant.loader'
import { AuthAdminTenant } from '@island.is/api/schema'

const Tenant = () => {
  const { formatMessage } = useLocale()
  const [title, setTitle] = useState<string>(formatMessage(m.idsAdmin))
  const tenantInfo = useRouteLoaderData(tenantLoaderId) as AuthAdminTenant

  useEffect(() => {
    setTitle(tenantInfo.defaultEnvironment.displayName[0].value)
  }, [tenantInfo])

  return (
    <Layout
      navTitle={title ?? formatMessage(m.idsAdmin)}
      navItems={idsAdminNav}
    >
      <Outlet />
    </Layout>
  )
}

export default Tenant
