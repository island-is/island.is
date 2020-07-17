import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

const sleep = (ms = 0) => {
  return new Promise((r) => setTimeout(r, ms))
}

export const documentsModule: ServicePortalModule = {
  navigation: async () => {
    await sleep(500)
    return {
      name: 'Rafræn skjöl',
      url: '/rafraen-skjol',
      icon: 'article',
    }
  },
  widgets: () => lazy(() => import('./widgets')),
  render: () => lazy(() => import('./lib/service-portal-documents')),
}
