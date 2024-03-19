import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@island.is/auth/delegations/index:system-write',
    displayName: 'Write kerfisaðgangur að delegation index',
    description: 'Gefur kerfisaðgang til að skrifa í delegation index',
  }),
  createScope({
    name: '@island.is/auth/delegations/index:system',
    displayName: 'Read kerfisaðgangur að delegation index',
    description: 'Gefur kerfisaðgang til að lesa úr delegation index',
  }),
)
