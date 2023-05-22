import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@island.is/rights-portal',
    displayName: 'Heilsa web scope',
    description: 'Skoða upplýsingar varðandi heilsu og sjúkratryggingar.',
    addToClients: ['@island.is/web'],
    addToResource: '@island.is',
    delegation: {
      legalGuardians: true,
    },
  }),
  createScope({
    name: '@sjukra.is/minarsidur',
    displayName: 'Sjúkratryggingar - mínar síður',
    description: 'Yfirlit á gögnum notanda hja Sjúkratryggingum',
    addToClients: ['@island.is/clients/api'],
    addToResource: '@sjukra.is',
  }),
)
