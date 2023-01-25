import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@island.is/activities',
    displayName: 'Atburðarsaga',
    description: 'Uppfletting á öllum tegundum á atburðum',
    addToClients: ['@island.is/web'],
    addToResource: '@island.is',
  }),
)
