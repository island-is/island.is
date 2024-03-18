import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@island.is/auth/delegations/index:system-write',
    displayName: 'Write aðgangur að delegation index',
    description: 'Gefur aðgang til að skrifa í delegation index',
  }),
  createScope({
    name: '@island.is/auth/delegations/index:system',
    displayName: 'Read aðgangur að delegation index',
    description: 'Gefur aðgang til að lesa úr delegation index',
  }),
)
