import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@island.is/work-machines',
    displayName: 'Aðgangur að vinnuvélaupplýsingum',
    description: 'Veitir aðgang að upplýsingum um vinnuvélar í eigu notanda',
    addToClients: ['@island.is/web'],
    addToResource: '@island.is',
  }),
)
