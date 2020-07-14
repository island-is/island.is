import { Subject } from '../models/subject'

export default [
  {
    id: 1,
    name: 'Ólafur Björn Magnússon',
    nationalId: '2606862759',
    scope: [
      '@island.is/finance',
      '@island.is/finance/personal.edit',
      '@island.is/finance/vaccines.view',
      '@farmalastofa/finance/rsk.view',
      '@fjarmalastofa/procure/companystatus.view',
      '@sendiradid/staff/health.view',
    ],
    subjectType: 'person',
  },
  {
    id: 2,
    name: 'Sendiráðið',
    nationalId: '5401482231',
    scope: [
      '@island.is/finance',
      '@island.is/finance/accounts',
      '@island.is/finance/vaccines.view',
      '@fjarmalastofa/finance/rsk.edit',
      '@fjarmalastofa/procure/companystatus.edit',
      '@sendiradid/staff/health.edit',
    ],
    subjectType: 'company',
  },
  {
    id: 3,
    name: 'Þjóðskrá',
    nationalId: '7401482231',
    scope: [
      '@island.is/finance',
      '@island.is/finance/perscriptions.edit',
      '@island.is/finance/vaccines.view',
    ],
    subjectType: 'instituion',
  },
] as Subject[]
