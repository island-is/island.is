import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@island.is/auth/passkeys',
    displayName: 'Aðgangslyklar',
    description:
      'Gerir notanda kleift að innskrá sig með lífkenni í gegnum aðgangslykil',
    addToResource: '@island.is',
    addToClients: ['@island.is/app'],
  }),
)
