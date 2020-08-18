import { ServicePortalModule } from '@island.is/service-portal/core'
import { ServicePortalPath } from '@island.is/service-portal/constants'
import { lazy } from 'react'

export const applicationsModule: ServicePortalModule = {
  name: 'Umsóknir',
  widgets: () => [
    {
      name: 'Umsóknir',
      weight: 0,
      render: () => lazy(() => import('./widgets')),
    },
  ],
  routes: (userInfo) => {
    const applicationRoutes = [
      {
        name: 'Umsóknir',
        path: ServicePortalPath.Umsoknir.Umsoknir,
        render: () => lazy(() => import('./lib/service-portal-applications')),
      },
    ]

    if (userInfo.sub.subjectType === 'person') {
      applicationRoutes.push({
        name: 'Ný umsókn',
        path: ServicePortalPath.Umsoknir.NyUmsokn,
        render: () => lazy(() => import('./lib/service-portal-applications')),
      })
      applicationRoutes.push({
        name: 'Opnar umsóknir',
        path: ServicePortalPath.Umsoknir.OpnarUmsoknir,
        render: () => lazy(() => import('./lib/service-portal-applications')),
      })
    }

    return applicationRoutes
  },
}
