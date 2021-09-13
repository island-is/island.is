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
    title: '3. mgr. 97. gr.',
    id: CaseCustodyProvisions._97_3,
    info: laws[CaseCustodyProvisions._97_3],
  },
  {
    title: '2. mgr. 98. gr',
    id: CaseCustodyProvisions._98_2,
    info: laws[CaseCustodyProvisions._98_2],
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
  {
    title: '1. mgr. 115. gr. útll.',
    id: CaseCustodyProvisions._115_1,
    info: laws[CaseCustodyProvisions._115_1],
  },
]

export const travelBanProvisions = custodyProvisions.filter(
  (provision) =>
    provision.id === CaseCustodyProvisions._95_1_A ||
    provision.id === CaseCustodyProvisions._95_1_B ||
    provision.id === CaseCustodyProvisions._100_1,
)
