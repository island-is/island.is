import { laws } from '@island.is/judicial-system-web/messages'

import type { CheckboxInfo } from '../components/CheckboxList/CheckboxList'
import { CaseLegalProvisions } from '../graphql/schema'

const makeCheckboxInfo = (
  legalProvision: CaseLegalProvisions,
): CheckboxInfo => ({
  title: laws[legalProvision].title,
  id: legalProvision,
  info: laws[legalProvision].info,
})

export const legalProvisions: CheckboxInfo[] = [
  makeCheckboxInfo(CaseLegalProvisions._95_1_A),
  makeCheckboxInfo(CaseLegalProvisions._95_1_B),
  makeCheckboxInfo(CaseLegalProvisions._95_1_C),
  makeCheckboxInfo(CaseLegalProvisions._95_1_D),
  makeCheckboxInfo(CaseLegalProvisions._95_2),
  makeCheckboxInfo(CaseLegalProvisions._99_1_B),
  makeCheckboxInfo(CaseLegalProvisions._100_1),
]

export const travelBanProvisions = legalProvisions.filter(
  (provision) =>
    provision.id === CaseLegalProvisions._95_1_A ||
    provision.id === CaseLegalProvisions._95_1_B ||
    provision.id === CaseLegalProvisions._100_1,
)
