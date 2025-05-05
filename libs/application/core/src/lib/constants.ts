import {
  PruningApplication,
  PruningNotification,
  StateLifeCycle,
} from '@island.is/application/types'

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

export const defaultLifecycleWithPruneMessage = (
  message:
    | PruningNotification
    | ((application: PruningApplication) => PruningNotification),
) => ({
  ...DefaultStateLifeCycle,
  pruneMessage: message,
})

export const NO_ANSWER = null

export const YES = 'yes'
export const NO = 'no'
export type YesOrNo = typeof YES | typeof NO
export enum YesOrNoEnum {
  YES = 'yes',
  NO = 'no',
}

export const hasYes = (answer: any) => {
  if (Array.isArray(answer)) {
    return answer.includes(YES)
  }

  if (answer instanceof Object) {
    return Object.values(answer).includes(YES)
  }

  return answer === YES
}

export const DEFAULT_FILE_SIZE_LIMIT = 10000000 // 10MB
export const DEFAULT_TOTAL_FILE_SIZE_SUM = 100000000 // 100MB, too high?
export const DEFAULT_ALLOWED_FILE_TYPES =
  '.pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic'

export const EMAIL_REGEX =
  /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
export const NATIONAL_ID_REGEX = /([0-9]){6}-?([0-9]){4}/
