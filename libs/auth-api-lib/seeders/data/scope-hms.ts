import { createScope } from './helpers'

export const up = createScope({
  name: '@island.is/applications/hms',
  displayName: 'Húsnæðis og mannvirkjastofnun',
  description: 'Umsóknir hjá Húsnæðis og mannvirkjastofnun',

  delegation: {
    custom: true,
    procuringHolders: true,
  },
  addToClients: ['@island.is/web'],
})
