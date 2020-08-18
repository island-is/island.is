import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

export const applicationsModule: ServicePortalModule = {
  name: 'Umsóknir',
  navigation: (props) => {
    if (props.sub.subjectType === 'company')
      return {
        name: 'Umsóknir',
        url: '/umsoknir',
        icon: 'user',
        section: 'actions',
        order: 0,
      }
    return {
      name: 'Umsóknir',
      url: '/umsoknir',
      icon: 'user',
      section: 'actions',
      order: 0,
      children: [
        {
          name: 'Opnar umsóknir',
          url: '/umsoknir/opnar-umsoknir',
        },
        {
          name: 'Ný umsókn',
          url: '/umsoknir/ny-umsokn',
        },
      ],
    }
  },
  widgets: () => [
    {
      name: 'Umsóknir',
      weight: 0,
      render: () => lazy(() => import('./widgets')),
    },
  ],
  routes: () => [
    {
      name: 'Umsóknir',
      path: '/umsoknir',
      render: () => lazy(() => import('./lib/service-portal-applications')),
    },
  ],
}
