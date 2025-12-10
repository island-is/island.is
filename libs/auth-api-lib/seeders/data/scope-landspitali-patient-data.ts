import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@landspitali.is/patientdata:read',
    displayName: 'landspitali patient data',
    description: 'Veitir aðgang að heilsuupplýsingum frá Landspítala',
    addToClients: ['@island.is/clients/api'],
  }),
)
