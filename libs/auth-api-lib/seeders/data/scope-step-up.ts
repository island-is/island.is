import { createScope } from './helpers'

export const up = createScope({
  name: '@island.is/auth/step-up',
  displayName: 'Auðkenning fyrir viðkvæmar aðgerðir',
  description:
    'Staðfesting notanda á viðkvæmri aðgerð með rafrænum skilríkjum.',
  claims: ['nationalId', 'audkenni_certificate_sha256', 'step_up_context_hash'],
  addToClients: ['@island.is/clients/step-up'],
})
