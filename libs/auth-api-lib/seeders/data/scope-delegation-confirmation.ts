import { createScope } from './helpers'

/**
 * The scope delegation-api's step-up token is issued for. Its claims are what
 * delegation-api needs to complete a confirmation and keep as evidence: who
 * approved, the fingerprint of the certificate they signed with, and the
 * content hash the approval was bound to.
 */
export const up = createScope({
  name: '@island.is/auth/delegation-confirmation',
  displayName: 'Staðfesting umboða',
  description:
    'Staðfesting veitanda á viðkvæmu umboði með rafrænum skilríkjum.',
  claims: ['nationalId', 'audkenni_certificate_sha256', 'step_up_context_hash'],
  addToClients: ['@island.is/clients/delegation-confirmation'],
})
