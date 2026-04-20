import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@landspitali.is/questionnaires:read',
    displayName: 'LSH questionnaires - read',
    description:
      'Veitir aðgang að upplýsingum um spurningalista frá Landspítala',
    addToClients: ['@island.is/clients/api'],
  }),
  createScope({
    name: '@landspitali.is/questionnaires:write',
    displayName: 'LSH questionnaires - write',
    description: 'Veitir heimild til að svara spurningalista frá Landspítala',
    addToClients: ['@island.is/clients/api'],
  }),
)
