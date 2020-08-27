import {
  Field,
  findSectionIndexForScreen,
  findSubSectionIndexForScreen,
  FormItemTypes,
  FormLeaf,
  FormValue,
  getSubSectionsInSection,
  MultiField,
  Repeater,
  shouldShowFormLeaf,
} from '@island.is/application/schema'
import { ApplicationUIState } from './ReducerTypes'
import {
  FieldDef,
  FormScreen,
  MultiFieldScreen,
  RepeaterScreen,
} from '../types'
import { getValueViaPath } from '../utils'

export function calculateProgress(
  activeScreenIndex: number,
  screens: FormScreen[],
): number {
  if (activeScreenIndex <= 0) {
    return 0
  } else if (activeScreenIndex >= screens.length - 1) {
    return 100
  }
  let screensThatCountForProgress = 0
  let pastScreensThatDontCountForProgress = 0

  for (let i = 0; i < screens.length; i++) {
    const screen = screens[i]
    if (screen.isNavigable && screen.repeaterIndex === undefined) {
      screensThatCountForProgress += 1
    } else if (i <= activeScreenIndex) {
      pastScreensThatDontCountForProgress += 1
    }
  }
  return (
    ((activeScreenIndex - pastScreensThatDontCountForProgress) /
      screensThatCountForProgress) *
    100
  )
}

export const findCurrentScreen = (
  screens: FormScreen[],
  formValue: FormValue,
): number => {
  let currentScreen = 0
  screens.forEach((screen, index) => {
    if (screen.type === FormItemTypes.MULTI_FIELD) {
      let numberOfAnsweredQuestionsInScreen = 0
      screen.children.forEach((field) => {
        if (getValueViaPath(formValue, field.id) !== undefined) {
          numberOfAnsweredQuestionsInScreen++
        }
      })
      if (numberOfAnsweredQuestionsInScreen === screen.children.length) {
        currentScreen = index + 1
      } else if (numberOfAnsweredQuestionsInScreen > 0) {
        currentScreen = index
      }
    } else if (screen.type === FormItemTypes.REPEATER) {
      if (getValueViaPath(formValue, screen.id) !== undefined) {
        currentScreen = index
      }
    } else {
      if (getValueViaPath(formValue, screen.id) !== undefined) {
        currentScreen = index + 1
      }
    }
  })
  return Math.min(currentScreen, screens.length - 1)
}

export const moveToScreen = (
  state: ApplicationUIState,
  screenIndex: number,
  isMovingForward: boolean,
): ApplicationUIState => {
  const { form, sections, screens } = state
  if (screenIndex < 0) {
    return {
      ...state,
      activeScreen: 0,
      activeSection: 0,
      activeSubSection: 0,
      progress: 0,
    }
  }
  if (screenIndex === screens.length) {
    const subSections = getSubSectionsInSection(sections[sections.length - 1])
    return {
      ...state,
      activeScreen: screens.length - 1,
      activeSection: sections.length - 1,
      activeSubSection: subSections.length ? subSections.length - 1 : -1,
      progress: 100,
    }
  }

  const screen = screens[screenIndex]
  if (!screen.isNavigable) {
    if (isMovingForward) {
      // skip this screen and go to the next one
      return moveToScreen(state, screenIndex + 1, isMovingForward)
    }
    return moveToScreen(state, screenIndex - 1, isMovingForward)
  }
  const sectionIndexForScreen = findSectionIndexForScreen(form, screen)

  const subSectionIndexForScreen =
    sectionIndexForScreen === -1
      ? -1
      : findSubSectionIndexForScreen(sections[sectionIndexForScreen], screen)

  return {
    ...state,
    activeScreen: screenIndex,
    activeSection: sectionIndexForScreen,
    activeSubSection: subSectionIndexForScreen,
    progress: calculateProgress(screenIndex, screens),
  }
}

function immutableSplice<T>(
  arr: T[],
  start: number,
  deleteCount: number,
  ...items: T[]
): T[] {
  return [...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount)]
}

export function expandRepeater(
  repeaterIndex: number,
  formLeaves: FormLeaf[],
  screens: FormScreen[],
  formValue: FormValue,
): [FormLeaf[], FormScreen[]] {
  const repeater = formLeaves[repeaterIndex]
  if (!repeater || repeater.type !== FormItemTypes.REPEATER) {
    return [undefined, undefined]
  }
  const { children, id, repetitions = 0 } = repeater
  let newFormLeaves = immutableSplice(formLeaves, repeaterIndex, 1, {
    ...repeater,
    repetitions: repetitions + 1,
  })
  let newFormScreens = immutableSplice(
    screens,
    repeaterIndex,
    1,
    convertLeafToScreen(
      {
        ...repeater,
        repetitions: repetitions + 1,
      },
      formValue,
    ),
  )
  const improvedFormLeaves: FormLeaf[] = []
  const improvedFormScreens: FormScreen[] = []
  for (let k = 0; k < children.length; k++) {
    const child = children[k]
    const improvedChild = {
      ...child,
      repeaterIndex,
      id: `${id}[${repetitions}].${child.id}`,
    }
    improvedFormLeaves[k] = improvedChild
    improvedFormScreens[k] = convertLeafToScreen(improvedChild, formValue)
  }
  newFormLeaves = immutableSplice(
    newFormLeaves,
    repeaterIndex + 1 + children.length * repetitions,
    0,
    ...improvedFormLeaves,
  )
  newFormScreens = immutableSplice(
    newFormScreens,
    repeaterIndex + 1 + children.length * repetitions,
    0,
    ...improvedFormScreens,
  )

  return [newFormLeaves, newFormScreens]
}

function convertFieldToScreen(field: Field, formValue: FormValue): FieldDef {
  return {
    ...field,
    isNavigable: shouldShowFormLeaf(field as Field, formValue),
  } as FieldDef
}

function convertMultiFieldToScreen(
  multiField: MultiField,
  formValue: FormValue,
): MultiFieldScreen {
  let isMultiFieldVisible = false
  const children = []
  multiField.children.forEach((field) => {
    const isFieldVisible = shouldShowFormLeaf(field, formValue)
    if (isFieldVisible) {
      isMultiFieldVisible = true
    }
    children.push({ ...field, isNavigable: isFieldVisible })
  })
  return {
    ...multiField,
    isNavigable: isMultiFieldVisible,
    children,
  } as MultiFieldScreen
}

function convertRepeaterToScreen(
  repeater: Repeater,
  formValue: FormValue,
): RepeaterScreen {
  const children = []
  repeater.children.forEach((field) => {
    children.push(convertLeafToScreen(field, formValue))
  })
  return {
    ...repeater,
    isNavigable: shouldShowFormLeaf(repeater, formValue),
    children,
  } as RepeaterScreen
}

export function convertLeafToScreen(
  leaf: FormLeaf,
  formValue: FormValue,
): FormScreen {
  if (leaf.type === FormItemTypes.MULTI_FIELD) {
    return convertMultiFieldToScreen(leaf, formValue)
  } else if (leaf.type === FormItemTypes.REPEATER) {
    return convertRepeaterToScreen(leaf, formValue)
  }
  return convertFieldToScreen(leaf, formValue)
}

export function convertLeavesToScreens(
  formLeaves: FormLeaf[],
  formValue: FormValue,
): FormScreen[] {
  return formLeaves.map((leaf) => convertLeafToScreen(leaf, formValue))
}
