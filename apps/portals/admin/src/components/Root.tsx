import { Outlet } from 'react-router-dom'

import { AuthProvider } from '@island.is/auth/react'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { PortalProvider } from '@island.is/portals/core'

import { modules } from '../lib/modules'
import environment from '../environments/environment'
import { Layout } from './Layout/Layout'
import { AdminPortalPaths } from '../lib/paths'

export const Root = () => {
  return (
    <AuthProvider>
      <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
        <PortalProvider
          modules={modules}
          meta={{
            basePath: AdminPortalPaths.Base,
            portalType: 'admin',
          }}
        >
          <Layout>
            <Outlet />
          </Layout>
        </PortalProvider>
      </FeatureFlagProvider>
    </AuthProvider>
  )
}
