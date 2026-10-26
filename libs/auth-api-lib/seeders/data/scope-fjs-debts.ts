import { createScope } from './helpers'

export const up = createScope({
  name: '@island.is/applications/fjs:debts',
  displayName: 'Fjársýsla ríkisins',
  description: 'Greiðsla skulda við ríkið',

  delegation: {
    custom: true,
    procuringHolders: true,
  },
  addToClients: ['@island.is/web'],
})
