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

export const moveToScreen = (
  state: ApplicationUIState,
  screenIndex: number,
): ApplicationUIState => {
  const { activeScreen, form, sections, screens } = state
  const isMovingForward = screenIndex > activeScreen
  if (screenIndex < 0) {
    return { ...state, activeScreen: 0, activeSection: 0, activeSubSection: 0 }
  }
  if (screenIndex === screens.length) {
    const subSections = getSubSectionsInSection(sections[sections.length - 1])
    return {
      ...state,
      activeScreen: screens.length - 1,
      activeSection: sections.length - 1,
      activeSubSection: subSections.length ? subSections.length - 1 : -1,
    }
  }

  const screen = screens[screenIndex]
  if (!screen.isNavigable) {
    if (isMovingForward) {
      // skip this screen and go to the next one
      return moveToScreen(state, screenIndex + 1)
    }
    return moveToScreen(state, screenIndex - 1)
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
