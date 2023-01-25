import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@island.is/sessions',
    displayName: 'Innskráningar',
    description: 'Uppfletting á innskráningum notandans',
    addToClients: ['@island.is/web'],
    addToResource: '@island.is',
  }),
  createScope({
    name: '@island.is/sessions:write',
    displayName: 'Skráning á innskráningum',
    description: 'Skráning á innskráningar atburðum',
    addToResource: '@island.is',
  }),
)
