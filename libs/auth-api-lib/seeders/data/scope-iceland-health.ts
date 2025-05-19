import { createScope } from './helpers'

export const up = createScope({
  name: '@island.is/iceland-health',
  displayName: 'Iceland Health applications',
  description: 'Allow access to Iceland Health applications',

  delegation: {
    custom: true,
  },
  addToClients: ['@island.is/web'],
})
