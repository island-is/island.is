import { resolveFormItemId } from '@island.is/application/core'
import {
  FormScreen,
  findCurrentScreen,
  moveToScreen,
} from '@island.is/application/screen-compiler'
import type {
  Application,
  ApplicationWithAttachments,
  FormValue,
} from '@island.is/application/types'
import type { BffUser } from '@island.is/shared/types'

export type ApplicationSnapshotInput = Partial<ApplicationWithAttachments> & {
  toJSON?: () => Partial<ApplicationWithAttachments>
}

/** A plain copy of an application, whether it is a model instance or not. */
export const toApplicationSnapshot = (
  application: ApplicationSnapshotInput,
): Partial<ApplicationWithAttachments> => {
  if (typeof application.toJSON === 'function') {
    return application.toJSON()
  }

  return { ...application }
}

/**
 * A plain copy of `application` with its answers replaced by `answers`.
 * Everything else, including `externalData`, keeps its saved value.
 */
export const toWorkingApplication = (
  application: ApplicationSnapshotInput,
  answers: FormValue,
): ApplicationWithAttachments =>
  ({
    ...toApplicationSnapshot(application),
    answers,
  } as ApplicationWithAttachments)

export type ClaimedScreen = { valid: true; index: number } | { valid: false }

/**
 * Looks up the screen with the id `claimedId`. The claim is valid when such a
 * screen exists and can be navigated to; a screen hidden by its conditions
 * cannot. An empty id never matches. When several screens share an id, the
 * first one counts.
 */
export const resolveClaimedScreen = (
  screens: FormScreen[],
  claimedId: string,
  application: Application,
  user?: BffUser,
): ClaimedScreen => {
  if (!claimedId) {
    return { valid: false }
  }

  const index = findScreenIndex(screens, claimedId, application, user)

  return index >= 0 && screens[index].isNavigable
    ? { valid: true, index }
    : { valid: false }
}

/**
 * The index of the first screen with the id `id`, shown or not, or -1 when
 * there is none.
 */
export const findScreenIndex = (
  screens: FormScreen[],
  id: string,
  application: Application,
  user?: BffUser,
): number =>
  id
    ? screens.findIndex(
        (screen) => resolveFormItemId(screen, application, user) === id,
      )
    : -1

/**
 * The index of the screen to resume on: the first shown screen that is not
 * fully answered by `answers`, or the last shown screen when all of them are.
 */
export const resumeIndex = (
  screens: FormScreen[],
  answers: FormValue,
): number => {
  const index = moveToScreen(screens, findCurrentScreen(screens, answers), true)

  // Moving forward past the end returns the last screen even when it is
  // hidden, so step back to the nearest shown one.
  return screens[index]?.isNavigable
    ? index
    : moveToScreen(screens, index, false)
}
