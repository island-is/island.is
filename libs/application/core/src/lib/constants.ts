import { StateLifeCycle } from '@island.is/application/types'

export const DEPRECATED_DefaultStateLifeCycle: StateLifeCycle = {
  shouldBePruned: false,
  shouldBeListed: true,
} as const

export const DefaultStateLifeCycle: StateLifeCycle = {
  shouldBeListed: true,
  shouldBePruned: true,
  whenToPrune: 30 * 24 * 3600 * 1000, // 30 days
} as const

export const EphemeralStateLifeCycle: StateLifeCycle = {
  shouldBeListed: false,
  shouldBePruned: true,
  whenToPrune: 24 * 3600 * 1000,
} as const

export const NO_ANSWER = null
