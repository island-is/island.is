import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@island.is/estates',
    displayName: 'Dánarbú',
    description: 'Veitir aðgang að upplýsingum um dánarbú notanda',
    addToClients: ['@island.is/web'],
    addToResource: '@island.is',
  }),
  createScope({
    name: '@syslumenn.is/danarbu',
    displayName: 'Dánarbú',
    description: 'Veitir aðgang að upplýsingum um dánarbú',
    addToClients: ['@island.is/clients/api'],
    addToResource: '@syslumenn.is',
  }),
)
