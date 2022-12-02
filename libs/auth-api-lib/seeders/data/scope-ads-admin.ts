import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@vegagerdin.is/air-discount-scheme-admin',
    displayName: 'Air discount scheme(Loftbrú) admin aðgangur',
    description:
      'Yfirlit yfir notkun, gjaldfærslur, endurgreiðslur og handvirkir kóðar.',
    addToClients: [
      '@vegagerdin.is/air-discount-scheme',
      '@island.is/clients/api',
      '@island.is/clients/dev',
    ],
    addToResource: '@vegagerdin.is',
  }),
  createScope({
    name: '@admin.island.is/ads',
    displayName: 'Loftbrú',
    description:
      'Yfirlit yfir notkun, gjaldfærslur, endurgreiðslur og handvirkir kóðar.',
    accessControlled: true,
    addToClients: ['@admin.island.is/web'],
    addToResource: '@admin.island.is',
    delegation: {
      custom: true,
      procuringHolders: true,
    },
  }),
)
