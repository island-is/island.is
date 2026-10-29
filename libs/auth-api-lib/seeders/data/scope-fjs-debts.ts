import { createScope } from './helpers'

export const up = createScope({
  name: '@island.is/applications/fjs:debts',
  displayName: 'Fjársýsla ríkisins',
  description: {
    is: 'Greiðsla skulda við ríkið. Veitir einnig aðgang að Fjármál › Staða á Mínum síðum, þar með talið niðurhali reikninga.',
    en: 'Payment of debts owed to the state. Also grants access to Finance › Status on My Pages, including invoice downloads.',
  },

  delegation: {
    custom: true,
    procuringHolders: true,
  },
  addToClients: ['@island.is/web'],
})
