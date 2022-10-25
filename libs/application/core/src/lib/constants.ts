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

export const YES = 'yes'

export const hasYes = (answer: any) => {
  if (Array.isArray(answer)) {
    return answer.includes(YES)
  }

  if (answer instanceof Object) {
    return Object.values(answer).includes(YES)
  }

  return answer === YES
}
