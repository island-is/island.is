import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@admin.island.is/delegations',
    displayName: 'Aðgangsstýring',
    description:
      'Gefur leyfi til að veita öðrum aðgang að þeim upplýsingum og aðgerðum sem aðilinn hefur.',
    accessControlled: true,
    addToClients: ['@admin.island.is/web'],
    addToResource: '@admin.island.is',
    delegation: {
      custom: true,
      procuringHolders: true,
    },
  }),
)
