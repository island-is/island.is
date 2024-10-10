import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { UserProfileLocale } from '@island.is/shared/components'
import { UserOnboarding } from '@island.is/portals/my-pages/information'
import { Layout } from './Layout/Layout'

export const Root = () => (
  <>
    <UserProfileLocale />
    <Layout>
      <Outlet />
    </Layout>
    <Suspense fallback={null}>
      <UserOnboarding />
    </Suspense>
  </>
)
