import { createScope } from './helpers'

export const up = createScope({
  name: '@island.is/applications/directorate-of-equality',
  displayName: 'Jafnréttisstofa',
  description: 'Umsóknir hjá Jafnréttisstofu',

  delegation: {
    custom: true,
    procuringHolders: true,
  },
  addToClients: ['@island.is/web'],
})
