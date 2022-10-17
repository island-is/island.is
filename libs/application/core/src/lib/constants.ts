import { StateLifeCycle } from '@island.is/application/types'

export const EphemeralStateLifeCycle: StateLifeCycle = {
  shouldBeListed: false,
  shouldBePruned: true,
  whenToPrune: 24 * 3600 * 1000,
} as const

export const pruneAfterDays = (Days: number): StateLifeCycle => {
  return {
    shouldBeListed: true,
    shouldBePruned: true,
    whenToPrune: Days * 24 * 3600 * 1000,
  }
}

export const DefaultStateLifeCycle: StateLifeCycle = pruneAfterDays(30)

export const NO_ANSWER = null
