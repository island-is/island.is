import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@landlaeknir.is/health',
    displayName: 'health',
    description:
      'Veitir aðgang að upplýsingum um tilvísanir, biðlista og lyfjaávísanir',
    addToClients: ['@island.is/clients/api'],
  }),
)
