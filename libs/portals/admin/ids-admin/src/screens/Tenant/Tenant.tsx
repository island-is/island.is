import { Outlet, useLoaderData } from 'react-router-dom'

import { useLocale } from '@island.is/localization'

import { Layout } from '../../components/Layout/Layout'
import { m } from '../../lib/messages'
import { idsAdminNav } from '../../lib/navigation'
import { TenantLoaderResult } from './Tenant.loader'

const Tenant = () => {
  const { formatMessage, locale } = useLocale()
  const {
    defaultEnvironment: { displayName },
  } = useLoaderData() as TenantLoaderResult

  const tenantTitle =
    displayName.find((d) => d.locale === locale)?.value ??
    formatMessage(m.idsAdmin)

  return (
    <Layout navTitle={tenantTitle} navItems={idsAdminNav}>
      <Outlet />
    </Layout>
  )
}

export default Tenant
