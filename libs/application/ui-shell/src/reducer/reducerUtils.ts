import {
  ExternalDataProvider,
  Field,
  findSectionIndexForScreen,
  findSubSectionIndexForScreen,
  Form,
  FormItemTypes,
  FormLeaf,
  FormNode,
  FormValue,
  getSubSectionsInSection,
  getValueViaPath,
  isValidScreen,
  MultiField,
  Repeater,
  Section,
  shouldShowFormItem,
} from '@island.is/application/core'
import { ApplicationUIState } from './ReducerTypes'
import {
  ExternalDataProviderScreen,
  FieldDef,
  FormScreen,
  MultiFieldScreen,
  RepeaterScreen,
} from '../types'

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
  answers: FormValue,
): number => {
  let currentScreen = 0
  screens.forEach((screen, index) => {
    if (screen.type === FormItemTypes.MULTI_FIELD) {
      let numberOfAnsweredQuestionsInScreen = 0
      screen.children.forEach((field) => {
        if (getValueViaPath(answers, field.id) !== undefined) {
          numberOfAnsweredQuestionsInScreen++
        }
      })
      if (numberOfAnsweredQuestionsInScreen === screen.children.length) {
        currentScreen = index + 1
      } else if (numberOfAnsweredQuestionsInScreen > 0) {
        currentScreen = index
      }
    } else if (screen.type === FormItemTypes.REPEATER) {
      if (getValueViaPath(answers, screen.id) !== undefined) {
        currentScreen = index
      }
    } else if (screen.id && getValueViaPath(answers, screen.id) !== undefined) {
      currentScreen = index + 1
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

function updateNodeInTree(source: FormNode, target: FormNode): FormNode {
  if (source.type === target.type && source.id === target.id) {
    return target
  } else if (source.children !== undefined) {
    const newChildren: FormNode[] = []
    source.children.forEach((child: FormNode) => {
      newChildren.push(updateNodeInTree(child, target))
    })
    return {
      ...source,
      children: newChildren,
    } as FormNode
  }
  return source
}

export function expandRepeater(
  repeaterIndex: number,
  form: Form,
  screens: FormScreen[],
): Form | undefined {
  const repeater = screens[repeaterIndex]
  if (!repeater || repeater.type !== FormItemTypes.REPEATER) {
    return undefined
  }
  const newRepeater = { ...repeater, repetitions: repeater.repetitions + 1 }
  return updateNodeInTree(form, newRepeater) as Form
}

function convertFieldToScreen(
  field: Field,
  answers: FormValue,
  isParentNavigable = true,
): FieldDef {
  return {
    ...field,
    isNavigable:
      isParentNavigable && shouldShowFormItem(field as Field, answers),
  } as FieldDef
}

function convertDataProviderToScreen(
  externalDataProvider: ExternalDataProvider,
  answers: FormValue,
  isParentNavigable = true,
): ExternalDataProviderScreen {
  return {
    ...externalDataProvider,
    isNavigable:
      isParentNavigable && shouldShowFormItem(externalDataProvider, answers),
  }
}

export function convertMultiFieldToScreen(
  multiField: MultiField,
  answers: FormValue,
  isParentNavigable = true,
): MultiFieldScreen {
  let isMultiFieldVisible = false
  const children: FieldDef[] = []
  multiField.children.forEach((field) => {
    const isFieldVisible = shouldShowFormItem(field, answers)
    if (isFieldVisible) {
      isMultiFieldVisible = true
    }
    children.push({
      ...field,
      isNavigable: isFieldVisible && isParentNavigable,
    })
  })
  return {
    ...multiField,
    isNavigable: isMultiFieldVisible && isParentNavigable,
    children,
  } as MultiFieldScreen
}

function convertRepeaterToScreens(
  repeater: Repeater,
  answers: FormValue,
  isParentNavigable = true,
): FormScreen[] {
  const { id, children, repetitions } = repeater
  const newScreens: FormScreen[] = []
  for (let i = 0; i < repetitions; i++) {
    children.forEach((field, index) => {
      newScreens.push(
        ...convertLeafToScreens(
          {
            ...field,
            id: `${id}[${i}].${field.id}`,
            repeaterIndex: index + children.length * i,
          },
          answers,
          isParentNavigable,
        ),
      )
    })
  }
  return [
    {
      ...repeater,
      isNavigable: isParentNavigable && shouldShowFormItem(repeater, answers),
    } as RepeaterScreen,
    ...newScreens,
  ]
}

export function convertLeafToScreens(
  leaf: FormLeaf,
  answers: FormValue,
  isParentNavigable = true,
): FormScreen[] {
  if (leaf.type === FormItemTypes.MULTI_FIELD) {
    return [convertMultiFieldToScreen(leaf, answers, isParentNavigable)]
  } else if (leaf.type === FormItemTypes.REPEATER) {
    return convertRepeaterToScreens(leaf, answers, isParentNavigable)
  } else if (leaf.type === FormItemTypes.EXTERNAL_DATA_PROVIDER) {
    return [convertDataProviderToScreen(leaf, answers, isParentNavigable)]
  }
  return [convertFieldToScreen(leaf, answers, isParentNavigable)]
}

function convertFormNodeToScreens(
  formNode: FormNode,
  answers: FormValue,
  isParentNavigable: boolean,
): FormScreen[] {
  const { children } = formNode
  if (isValidScreen(formNode)) {
    return convertLeafToScreens(
      formNode as FormLeaf,
      answers,
      isParentNavigable,
    )
  }
  let screens: FormScreen[] = []
  let newScreens: FormScreen[] = []
  if (children) {
    for (let i = 0; i < children.length; i++) {
      newScreens = convertFormNodeToScreens(
        children[i],
        answers,
        isParentNavigable && shouldShowFormItem(children[i], answers),
      )
      if (newScreens.length) {
        screens = [...screens, ...newScreens]
      }
    }
  }
  return screens
}

export function convertFormToScreens(
  form: Form,
  answers: FormValue,
): FormScreen[] {
  return convertFormNodeToScreens(form, answers, true)
}

export function getNavigableSectionsInForm(
  form: Form,
  answers: FormValue,
): Section[] {
  const sections: Section[] = []
  form.children.forEach((child) => {
    if (
      child.type === FormItemTypes.SECTION &&
      shouldShowFormItem(child, answers)
    ) {
      sections.push({
        ...(child as Section),
        children: child.children.filter((sectionChild) =>
          shouldShowFormItem(sectionChild, answers),
        ),
      })
    }
  })
  return sections
}
