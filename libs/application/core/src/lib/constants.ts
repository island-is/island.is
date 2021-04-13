import { StateLifeCycle } from '../types/StateMachine'

export const DefaultStateLifeCycle: StateLifeCycle = {
  shouldBePruned: false,
  shouldBeListed: true,
} as const
