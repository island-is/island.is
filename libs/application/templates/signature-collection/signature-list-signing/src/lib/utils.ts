import { StateLifeCycle } from '@island.is/application/types'

export const WeekLifeCycle: StateLifeCycle = {
  shouldBeListed: true,
  shouldBePruned: true,
  whenToPrune: 1000 * 3600 * 24 * 7,
}
