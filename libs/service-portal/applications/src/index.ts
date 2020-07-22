import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

const sleep = (ms = 0) => {
  return new Promise((r) => setTimeout(r, ms))
}

export const applicationsModule: ServicePortalModule = {
  name: 'Umsóknir',
  navigation: async (props) => {
    await sleep(1000)
    if (props.sub.nationalId === '5401482231')
      return {
        name: 'Umsóknir',
        url: '/umsoknir',
        icon: 'user',
      }
    return {
      name: 'Umsóknir',
      url: '/umsoknir',
      icon: 'user',
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
