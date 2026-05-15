import React from 'react'

import { EditTenant } from './EditTenant'
import { TenantProvider } from './TenantContext'
import { PublishTenant } from './PublishTenant'

/**
 * Route-level wrapper that mounts the tenant context (so the edit form can
 * track the currently selected environment) and the publish flow (for
 * copying a tenant from one environment to another).
 */
const EditTenantRoute = () => (
  <TenantProvider>
    <EditTenant />
    <PublishTenant />
  </TenantProvider>
)

export default EditTenantRoute
