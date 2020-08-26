import { Actor } from '../models/actor'

export default [
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
] as Actor[]
