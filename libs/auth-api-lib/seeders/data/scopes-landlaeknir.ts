import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@landlaeknir.is/vaccinations:admin',
    displayName: 'Vaccinations:admin',
    description: 'Veitir aðgang að admin upplýsingum um bólusetningar',
    addToClients: ['@island.is/clients/api'],
  }),
  createScope({
    name: '@landlaeknir.is/vaccinations',
    displayName: 'Vaccinations',
    description: 'Veitir aðgang að upplýsingum um bólusetningar',
    addToClients: ['@island.is/clients/api'],
  }),
  createScope({
    name: '@landlaeknir.is/organ-donations',
    displayName: 'organ-donations',
    description: 'Veitir aðgang að upplýsingum um líffæragjafir',
    addToClients: ['@island.is/clients/api'],
  }),
)
