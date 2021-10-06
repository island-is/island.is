import { CaseCustodyProvisions } from '@island.is/judicial-system/types'
import { laws } from '@island.is/judicial-system-web/messages'

export const custodyProvisions = [
  {
    title: 'a-lið 1. mgr. 95. gr.',
    id: CaseCustodyProvisions._95_1_A,
    info: laws[CaseCustodyProvisions._95_1_A],
  },
  {
    title: 'b-lið 1. mgr. 95. gr.',
    id: CaseCustodyProvisions._95_1_B,
    info: laws[CaseCustodyProvisions._95_1_B],
  },
  {
    title: 'c-lið 1. mgr. 95. gr.',
    id: CaseCustodyProvisions._95_1_C,
    info: laws[CaseCustodyProvisions._95_1_C],
  },
  {
    title: 'd-lið 1. mgr. 95. gr.',
    id: CaseCustodyProvisions._95_1_D,
    info: laws[CaseCustodyProvisions._95_1_D],
  },
  {
    title: '2. mgr. 95. gr.',
    id: CaseCustodyProvisions._95_2,
    info: laws[CaseCustodyProvisions._95_2],
  },
  {
    title: 'b-lið 1. mgr. 99. gr.',
    id: CaseCustodyProvisions._99_1_B,
    info: laws[CaseCustodyProvisions._99_1_B],
  },
  {
    title: '1. mgr. 100. gr.',
    id: CaseCustodyProvisions._100_1,
    info: laws[CaseCustodyProvisions._100_1],
  },
]

export const travelBanProvisions = custodyProvisions.filter(
  (provision) =>
    provision.id === CaseCustodyProvisions._95_1_A ||
    provision.id === CaseCustodyProvisions._95_1_B ||
    provision.id === CaseCustodyProvisions._100_1,
)
