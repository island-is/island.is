import { StateLifeCycle } from '@island.is/application/types'

export const DefaultStateLifeCycle: StateLifeCycle = {
  shouldBePruned: false,
  shouldBeListed: true,
} as const

export const EphemeralStateLifeCycle: StateLifeCycle = {
  shouldBeListed: false,
  shouldBePruned: true,
  whenToPrune: 24 * 3600 * 1000,
} as const

export const NO_ANSWER = null
