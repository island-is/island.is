import { createScope } from './helpers'

export const up = createScope({
  name: '@island.is/directorate-of-equality',
  displayName: 'Jafnréttisstofa',
  description: 'Innsendingar og aðgangslyklar fyrirtækis hjá Jafnréttisstofu',

  delegation: {
    custom: true,
    procuringHolders: true,
  },
  addToClients: ['@island.is/web'],
})
