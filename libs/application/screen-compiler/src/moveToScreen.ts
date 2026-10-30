import { FormValue } from '@island.is/application/types'

import { FormScreen } from './types'
import { screenRequiresAnswer, screenHasBeenAnswered } from './answerUtils'

export const findCurrentScreen = (
  screens: FormScreen[],
  answers: FormValue,
): number => {
  let lastAnswerIndex = -1
  let index = 0

  while (index < screens.length) {
    const screen = screens[index]

    if (!screenRequiresAnswer(screen)) {
      index += 1
      continue
    }

    const hasBeenAnswered = screenHasBeenAnswered(screen, answers)
    const hasBeenPartlyAnswered = screenHasBeenAnswered(screen, answers, true)

    if (hasBeenAnswered) {
      lastAnswerIndex = index
    } else if (hasBeenPartlyAnswered) {
      lastAnswerIndex = index
      break
    } else {
      break
    }

    index += 1
  }

  return Math.max(Math.min(index, lastAnswerIndex + 1, screens.length - 1), 0)
}

export const moveToScreen = (
  screens: FormScreen[],
  screenIndex: number,
  isMovingForward: boolean,
): number => {
  if (screenIndex < 0) {
    return 0
  }

  if (screenIndex >= screens.length) {
    return screens.length - 1
  }

  const screen = screens[screenIndex]

  if (!screen.isNavigable) {
    if (isMovingForward) {
      return moveToScreen(screens, screenIndex + 1, isMovingForward)
    }

    return moveToScreen(screens, screenIndex - 1, isMovingForward)
  }

  return screenIndex
}

export const canGoBack = (
  screens: FormScreen[],
  screenIndex: number,
): boolean => {
  if (screenIndex <= 0) {
    return false
  }

  for (let i = screenIndex - 1; i >= 0; i--) {
    if (screens[i].isNavigable) {
      return true
    }
  }

  return false
}
