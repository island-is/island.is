import { createScope } from './helpers'

export const up = createScope({
  name: '@island.is/applications/iceland-health',
  displayName: 'Sjúkratryggingar Íslands',
  description: 'Veitir aðgengi að umsóknum til Sjúkratrygginga Íslands',

  delegation: {
    custom: true,
    procuringHolders: true,
  },
  addToClients: ['@island.is/web'],
})
