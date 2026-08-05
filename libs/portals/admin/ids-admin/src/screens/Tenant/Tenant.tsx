import { useMemo } from 'react'
import { Outlet, useLoaderData } from 'react-router-dom'

import { Features } from '@island.is/feature-flags'
import { useLocale } from '@island.is/localization'
import { useFeatureFlag } from '@island.is/react/feature-flags'

import { Layout } from '../../components/Layout/Layout'
import { useSuperAdmin } from '../../hooks/useSuperAdmin'
import { IDSAdminPaths } from '../../lib/paths'
import { m } from '../../lib/messages'
import { idsAdminNav } from '../../lib/navigation'
import { TenantLoaderResult } from './Tenant.loader'

const Tenant = () => {
  const { formatMessage, locale } = useLocale()
  const { isSuperAdmin } = useSuperAdmin()
  const { value: showAdminControlsFlag } = useFeatureFlag(
    Features.showIdsAdminControls,
    false,
  )
  const showAdminControls = isSuperAdmin && showAdminControlsFlag

  const {
    defaultEnvironment: { displayName },
  } = useLoaderData() as TenantLoaderResult

  const tenantTitle =
    displayName.find((d) => d.locale === locale)?.value ??
    formatMessage(m.idsAdmin)

  const navItems = useMemo(
    () => ({
      ...idsAdminNav,
      children: idsAdminNav.children?.map((child) =>
        child.path === IDSAdminPaths.IDSAdminTenantEdit
          ? { ...child, navHide: !showAdminControls }
          : child,
      ),
    }),
    [showAdminControls],
  )

  return (
    <Layout navTitle={tenantTitle} navItems={navItems}>
      <Outlet />
    </Layout>
  )
}

export default Tenant
