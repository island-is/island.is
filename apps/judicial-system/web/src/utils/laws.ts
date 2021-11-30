import { CaseLegalProvisions } from '@island.is/judicial-system/types'
import { laws } from '@island.is/judicial-system-web/messages'

export const legalProvisions = [
  {
    title: 'a-lið 1. mgr. 95. gr.',
    id: CaseLegalProvisions._95_1_A,
    info: laws[CaseLegalProvisions._95_1_A],
  },
  {
    title: 'b-lið 1. mgr. 95. gr.',
    id: CaseLegalProvisions._95_1_B,
    info: laws[CaseLegalProvisions._95_1_B],
  },
  {
    title: 'c-lið 1. mgr. 95. gr.',
    id: CaseLegalProvisions._95_1_C,
    info: laws[CaseLegalProvisions._95_1_C],
  },
  {
    title: 'd-lið 1. mgr. 95. gr.',
    id: CaseLegalProvisions._95_1_D,
    info: laws[CaseLegalProvisions._95_1_D],
  },
  {
    title: '2. mgr. 95. gr.',
    id: CaseLegalProvisions._95_2,
    info: laws[CaseLegalProvisions._95_2],
  },
  {
    title: 'b-lið 1. mgr. 99. gr.',
    id: CaseLegalProvisions._99_1_B,
    info: laws[CaseLegalProvisions._99_1_B],
  },
  {
    title: '1. mgr. 100. gr.',
    id: CaseLegalProvisions._100_1,
    info: laws[CaseLegalProvisions._100_1],
  },
]

export const travelBanProvisions = legalProvisions.filter(
  (provision) =>
    provision.id === CaseLegalProvisions._95_1_A ||
    provision.id === CaseLegalProvisions._95_1_B ||
    provision.id === CaseLegalProvisions._100_1,
)
