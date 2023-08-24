import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@island.is/auth/consents',
    displayName: 'Samþykki fyrir gagnaöflun',
    description: 'Umsýsla á samþykki fyrir gagnaöflun',
    addToResource: '@island.is',
    addToClients: ['@island.is/web'],
  }),
)
