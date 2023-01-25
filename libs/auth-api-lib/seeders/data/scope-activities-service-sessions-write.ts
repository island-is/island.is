import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@island.is/activities/sessions:write',
    displayName: 'Innskráningar atburðir',
    description: 'Skráning á innskráningar atburðum',
    addToResource: '@island.is',
  }),
)
