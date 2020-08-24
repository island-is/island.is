import { Subject, Actor } from '@island.is/service-portal/core'

export const mockSubjects: Subject[] = [
  {
    id: 1,
    name: 'Ólafur Björn Magnússon',
    nationalId: '2606862759',
    scope: [
      '@island.is/finance',
      '@island.is/finance/personal.edit',
      '@island.is/finance/vaccines.view',
      '@fjarmalastofa/finance/rsk.view',
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
    subjectType: 'institution',
  },
]

export const mockActors: Actor[] = [
  {
    id: 1,
    name: 'Ólafur Björn Magnússon',
    nationalId: '2606862759',
    subjectIds: [1, 2],
  },
  {
    id: 2,
    name: 'Baltasar Kormákur',
    nationalId: '0123456789',
    subjectIds: [2, 1],
  },
  {
    id: 3,
    name: 'Atli Guðlaugsson',
    nationalId: '1507922319',
    subjectIds: [1, 2],
  },
  {
    id: 4,
    name: 'Þorvarður Örn Einarsson',
    nationalId: '3001902359',
    subjectIds: [1, 2],
  },
]
