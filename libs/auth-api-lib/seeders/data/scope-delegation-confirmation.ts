import { createScope } from './helpers'

export const up = createScope({
  name: '@island.is/auth/delegation-confirmation',
  displayName: 'Staðfesting umboða',
  description:
    'Staðfesting veitanda á viðkvæmu umboði með rafrænum skilríkjum.',
  claims: ['nationalId', 'audkenni_certificate_sha256', 'step_up_context_hash'],
  addToClients: ['@island.is/clients/delegation-confirmation'],
})
