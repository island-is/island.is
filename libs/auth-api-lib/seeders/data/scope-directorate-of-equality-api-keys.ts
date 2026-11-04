import { createScope } from './helpers'

export const up = createScope({
  name: '@island.is/directorate-of-equality/api-keys',
  displayName: 'Jafnréttisstofa',
  description: 'Aðgangslyklar fyrirtækis hjá Jafnréttisstofu',

  delegation: {
    custom: true,
    procuringHolders: true,
  },
  addToClients: ['@island.is/web'],
})
