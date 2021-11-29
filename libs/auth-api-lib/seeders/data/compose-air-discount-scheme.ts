import { compose, createClient, createScope } from './helpers'

export const up = compose(
  createClient({
    clientId: '@vegagerdin.is/air-discount-scheme',
    clientType: 'web',
    displayName: 'Air Discount Scheme Client',
    description: 'Loftbrú Client',
    allowedScopes: ['openid', '@vegagerdin.is/air-discount-scheme', '@vegagerdin.is/air-discount-scheme:admin'],

    contactNationalId: '6802692899',
    contactEmail: 'julius@juni.is',
    redirectUris: {
        dev: ['http://localhost:4200/min-rettindi', 'https://beta.dev01.devland.is/min-rettindi'],
        staging: ['https://beta.staging01.devland.is/min-rettindi'],
        prod: ['https://loftbru.island.is/min-rettindi'],
      },
      postLogoutRedirectUri: {
        dev: 'https://beta.dev01.devland.is',
        staging: 'https://beta.staging01.devland.is',
        prod: 'https://island.is',
      },
  }),
  createScope({
    name: '@vegagerdin.is/air-discount-scheme',
    displayName: 'Air Discount Scheme',
    description: 'Loftbrú',
    addToClients: ['@vegagerdin.is/air-discount-scheme'],
  }),
  createScope({
    name: '@vegagerdin.is/air-discount-scheme:admin',
    displayName: 'Air Discount Scheme - Admin',
    description: 'Loftbrú admin',
    addToClients: ['@vegagerdin.is/air-discount-scheme'],
  }),
)