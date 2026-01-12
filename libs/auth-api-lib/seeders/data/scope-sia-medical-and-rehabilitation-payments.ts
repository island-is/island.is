import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@tr.is/sjukraogendurhaefingargreidslur:read',
    displayName: 'TR - Sjúkra- og endurhæfingargreiðslur',
    description: 'Bakendascope fyrir Sjúkra- og endurhæfingargreiðslur´',
    accessControlled: true,
    addToClients: [
      '@island.is/clients/application-system',
      '@island.is/clients/api',
    ],
    addToResource: '@tr.is',
  }),
)
