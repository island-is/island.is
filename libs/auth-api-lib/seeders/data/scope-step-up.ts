import { createScope } from './helpers'

/**
 * The scope the GraphQL API's step-up token is issued for. It only needs to
 * say who approved; the fingerprint and context hash come along for the
 * record.
 */
export const up = createScope({
  name: '@island.is/auth/step-up',
  displayName: 'Opnun læstra skjáa',
  description: 'Staðfesting með rafrænum skilríkjum á að eigandi sé við tækið.',
  claims: ['nationalId', 'audkenni_certificate_sha256', 'step_up_context_hash'],
  addToClients: ['@island.is/clients/step-up'],
})
