import { createScope } from './helpers'

export const up = createScope({
  name: '@island.is/applications/rsk',
  displayName: 'Skatturinn',
  description: 'Umsóknir hjá Skattinum',

  delegation: {
    custom: true,
    procuringHolders: true,
  },
  addToClients: ['@island.is/web'],
})
