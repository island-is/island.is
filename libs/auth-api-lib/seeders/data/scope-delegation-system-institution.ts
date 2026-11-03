import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@admin.island.is/delegation-system:institution',
    displayName: 'Yfirlit umboða stofnunar',
    description:
      'Gefur stofnun aðgang að yfirliti yfir umboð sem veitt hafa verið að þjónustum hennar.',
    accessControlled: true,
    addToClients: ['@admin.island.is/web'],
    addToResource: '@admin.island.is',
    delegation: {
      custom: true,
      procuringHolders: true,
    },
  }),
)
