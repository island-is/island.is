import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

const sleep = (ms = 0) => {
  return new Promise((r) => setTimeout(r, ms))
}

export const applicationsModule: ServicePortalModule = {
  name: 'Umsóknir',
  path: '/umsoknir',
  navigation: async (props) => {
    await sleep(1000)
    if (true)//props.sub.subjectType === 'company')
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
  widgets: () => lazy(() => import('./widgets')),
  render: () => lazy(() => import('./lib/service-portal-applications')),
}
