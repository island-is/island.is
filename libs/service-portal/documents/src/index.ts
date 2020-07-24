import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

const sleep = (ms = 0) => {
  return new Promise((r) => setTimeout(r, ms))
}

export const documentsModule: ServicePortalModule = {
  name: 'Rafræn skjöl',
  path: '/rafraen-skjol',
  navigation: async () => {
    await sleep(500)
    return {
      name: 'Rafræn skjöl',
      url: '/rafraen-skjol',
      icon: 'article',
      // TODO: This should be in actions
      section: 'info',
      order: 2,
    }
  },
  widgets: () => lazy(() => import('./widgets')),
  render: () => lazy(() => import('./lib/service-portal-documents')),
}
