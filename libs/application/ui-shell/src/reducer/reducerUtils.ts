import {
  ExternalDataProvider,
  Field,
  findSectionIndex,
  findSubSectionIndex,
  Form,
  FormItemTypes,
  FormLeaf,
  FormNode,
  FormValue,
  getValueViaPath,
  isValidScreen,
  MultiField,
  Repeater,
  Section,
  shouldShowFormItem,
  SubSection,
} from '@island.is/application/core'
import {
  ExternalDataProviderScreen,
  FieldDef,
  FormScreen,
  MultiFieldScreen,
  RepeaterScreen,
} from '../types'

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
  screens: FormScreen[],
  screenIndex: number,
  isMovingForward: boolean,
): number => {
  if (screenIndex < 0) {
    return 0
  }
  if (screenIndex === screens.length) {
    return screens.length - 1
  }

  const screen = screens[screenIndex]
  if (!screen.isNavigable) {
    if (isMovingForward) {
      // skip this screen and go to the next one
      return moveToScreen(screens, screenIndex + 1, isMovingForward)
    }
    return moveToScreen(screens, screenIndex - 1, isMovingForward)
  }

  return screenIndex
}

function convertFieldToScreen(
  field: Field,
  answers: FormValue,
  isParentNavigable = true,
  sectionIndex: number,
  subSectionIndex: number,
): FieldDef {
  return {
    ...field,
    isNavigable:
      isParentNavigable && shouldShowFormItem(field as Field, answers),
    sectionIndex,
    subSectionIndex,
  } as FieldDef
}

function convertDataProviderToScreen(
  externalDataProvider: ExternalDataProvider,
  answers: FormValue,
  isParentNavigable = true,
  sectionIndex: number,
  subSectionIndex: number,
): ExternalDataProviderScreen {
  return {
    ...externalDataProvider,
    isNavigable:
      isParentNavigable && shouldShowFormItem(externalDataProvider, answers),
    sectionIndex,
    subSectionIndex,
  }
}

export function convertMultiFieldToScreen(
  multiField: MultiField,
  answers: FormValue,
  isParentNavigable = true,
  sectionIndex: number,
  subSectionIndex: number,
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
      sectionIndex,
      subSectionIndex,
    })
  })
  return {
    ...multiField,
    isNavigable: isMultiFieldVisible && isParentNavigable,
    children,
    sectionIndex,
    subSectionIndex,
  } as MultiFieldScreen
}

function convertRepeaterToScreens(
  repeater: Repeater,
  answers: FormValue,
  isParentNavigable = true,
  sectionIndex: number,
  subSectionIndex: number,
): FormScreen[] {
  const { id, children } = repeater
  const newScreens: FormScreen[] = []
  function recursiveMap(field: FormLeaf, fn: (l: FormLeaf) => FormLeaf): any {
    if (Array.isArray(field.children)) {
      return (field.children as FormLeaf[]).map((c) => recursiveMap(c, fn))
    }
    return fn(field)
  }
  const repeatedValues = getValueViaPath(answers, id, []) as unknown[]
  for (let i = 0; i < repeatedValues.length; i++) {
    children.forEach((field) => {
      let grandChildren = field.children
      let fieldId = field.id
      if (Array.isArray(field.children)) {
        grandChildren = recursiveMap(field, (c) => ({
          ...c,
          id: `${id}[${i}].${c.id}`,
        }))
      } else {
        fieldId = `${id}[${i}].${field.id}`
      }
      newScreens.push(
        ...convertLeafToScreens(
          {
            ...field,
            children: grandChildren,
            id: fieldId,
            isPartOfRepeater: true,
          } as FormLeaf,
          answers,
          isParentNavigable,
          sectionIndex,
          subSectionIndex,
        ),
      )
    })
  }
  return [
    {
      ...repeater,
      isNavigable: isParentNavigable && shouldShowFormItem(repeater, answers),
      sectionIndex,
      subSectionIndex,
    } as RepeaterScreen,
    ...newScreens,
  ]
}

function convertLeafToScreens(
  leaf: FormLeaf,
  answers: FormValue,
  isParentNavigable = true,
  sectionIndex: number,
  subSectionIndex: number,
): FormScreen[] {
  if (leaf.type === FormItemTypes.MULTI_FIELD) {
    return [
      convertMultiFieldToScreen(
        leaf,
        answers,
        isParentNavigable,
        sectionIndex,
        subSectionIndex,
      ),
    ]
  } else if (leaf.type === FormItemTypes.REPEATER) {
    return convertRepeaterToScreens(
      leaf,
      answers,
      isParentNavigable,
      sectionIndex,
      subSectionIndex,
    )
  } else if (leaf.type === FormItemTypes.EXTERNAL_DATA_PROVIDER) {
    return [
      convertDataProviderToScreen(
        leaf,
        answers,
        isParentNavigable,
        sectionIndex,
        subSectionIndex,
      ),
    ]
  }
  return [
    convertFieldToScreen(
      leaf,
      answers,
      isParentNavigable,
      sectionIndex,
      subSectionIndex,
    ),
  ]
}

function convertFormNodeToScreens(
  formNode: FormNode,
  answers: FormValue,
  form: Form,
  isParentNavigable: boolean,
  sectionIndex: number,
  subSectionIndex: number,
): FormScreen[] {
  const { children } = formNode
  if (isValidScreen(formNode)) {
    return convertLeafToScreens(
      formNode as FormLeaf,
      answers,
      isParentNavigable,
      sectionIndex,
      subSectionIndex,
    )
  }
  let screens: FormScreen[] = []
  let newScreens: FormScreen[] = []
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (child.type === FormItemTypes.SECTION) {
        subSectionIndex = -1
        sectionIndex = findSectionIndex(form, child as Section)
      } else if (child.type === FormItemTypes.SUB_SECTION) {
        subSectionIndex = findSubSectionIndex(
          form,
          sectionIndex,
          child as SubSection,
        )
      }
      newScreens = convertFormNodeToScreens(
        child,
        answers,
        form,
        isParentNavigable && shouldShowFormItem(child, answers),
        sectionIndex,
        subSectionIndex,
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
  return convertFormNodeToScreens(form, answers, form, true, -1, -1)
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
