import { createScope } from './helpers'

export const up = createScope({
  name: '@island.is/applications/directorate-of-equality-salary',
  displayName: 'Jafnréttisstofa',
  description: 'Skýrslugjöf um kynbundinn launamun',

  delegation: {
    custom: true,
    procuringHolders: true,
  },
  addToClients: ['@island.is/web'],
})
