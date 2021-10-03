import { getDefaultValues } from '@apollo/client/utilities'
import {
  ExternalData,
  ExternalDataProvider,
  Field,
  findSectionIndex,
  findSubSectionIndex,
  Form,
  FormItemTypes,
  FormLeaf,
  FormNode,
  FormValue,
  getSectionsInForm,
  getSubSectionsInSection,
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
  let missingAnswerBeforeCurrentIndex = false
  let currentAnswerIndex = 0

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
    } else if (screen.id) {
      if (
        getValueViaPath(answers, screen.id) === undefined &&
        index > currentAnswerIndex
      ) {
        missingAnswerBeforeCurrentIndex = true
        currentAnswerIndex = index
      }

      if (
        !missingAnswerBeforeCurrentIndex &&
        getValueViaPath(answers, screen.id) !== undefined
      ) {
        currentScreen = index + 1
        currentAnswerIndex = index
      }
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

  if (screenIndex >= screens.length) {
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
  externalData: ExternalData,
  isParentNavigable = true,
  sectionIndex: number,
  subSectionIndex: number,
): FieldDef {
  return {
    ...field,
    isNavigable:
      isParentNavigable &&
      shouldShowFormItem(field as Field, answers, externalData),
    sectionIndex,
    subSectionIndex,
  } as FieldDef
}

function convertDataProviderToScreen(
  externalDataProvider: ExternalDataProvider,
  answers: FormValue,
  externalData: ExternalData,
  isParentNavigable = true,
  sectionIndex: number,
  subSectionIndex: number,
): ExternalDataProviderScreen {
  return {
    ...externalDataProvider,
    isNavigable:
      isParentNavigable &&
      shouldShowFormItem(externalDataProvider, answers, externalData),
    sectionIndex,
    subSectionIndex,
  }
}

export function convertMultiFieldToScreen(
  multiField: MultiField,
  answers: FormValue,
  externalData: ExternalData,
  isParentNavigable = true,
  sectionIndex: number,
  subSectionIndex: number,
): MultiFieldScreen {
  let isMultiFieldVisible = false
  const children: FieldDef[] = []

  multiField.children.forEach((field) => {
    const isFieldVisible = shouldShowFormItem(field, answers, externalData)

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
  externalData: ExternalData,
  isParentNavigable = true,
  sectionIndex: number,
  subSectionIndex: number,
): FormScreen[] {
  const { id, children } = repeater
  const newScreens: FormScreen[] = []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          externalData,
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
      isNavigable:
        isParentNavigable &&
        shouldShowFormItem(repeater, answers, externalData),
      sectionIndex,
      subSectionIndex,
    } as RepeaterScreen,
    ...newScreens,
  ]
}

function convertLeafToScreens(
  leaf: FormLeaf,
  answers: FormValue,
  externalData: ExternalData,
  isParentNavigable = true,
  sectionIndex: number,
  subSectionIndex: number,
): FormScreen[] {
  if (leaf.type === FormItemTypes.MULTI_FIELD) {
    return [
      convertMultiFieldToScreen(
        leaf,
        answers,
        externalData,
        isParentNavigable,
        sectionIndex,
        subSectionIndex,
      ),
    ]
  } else if (leaf.type === FormItemTypes.REPEATER) {
    return convertRepeaterToScreens(
      leaf,
      answers,
      externalData,
      isParentNavigable,
      sectionIndex,
      subSectionIndex,
    )
  } else if (leaf.type === FormItemTypes.EXTERNAL_DATA_PROVIDER) {
    return [
      convertDataProviderToScreen(
        leaf,
        answers,
        externalData,
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
      externalData,
      isParentNavigable,
      sectionIndex,
      subSectionIndex,
    ),
  ]
}

function convertFormNodeToScreens(
  formNode: FormNode,
  answers: FormValue,
  externalData: ExternalData,
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
      externalData,
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
      const sections = getSectionsInForm(form, answers, externalData)

      if (child.type === FormItemTypes.SECTION) {
        subSectionIndex = -1
        sectionIndex = findSectionIndex(sections, child as Section)
      } else if (child.type === FormItemTypes.SUB_SECTION) {
        const section = sections[sectionIndex]

        const subSections = getSubSectionsInSection(
          section,
          answers,
          externalData,
        )

        subSectionIndex =
          !section || sectionIndex === -1
            ? -1
            : findSubSectionIndex(subSections, child as SubSection)
      }

      const shouldBeVisible = shouldShowFormItem(child, answers, externalData)

      newScreens = convertFormNodeToScreens(
        child,
        answers,
        externalData,
        form,
        isParentNavigable && shouldBeVisible,
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
  externalData: ExternalData,
): FormScreen[] {
  return convertFormNodeToScreens(
    form,
    answers,
    externalData,
    form,
    true,
    -1,
    -1,
  )
}

export function getNavigableSectionsInForm(
  form: Form,
  answers: FormValue,
  externalData: ExternalData,
): Section[] {
  const sections: Section[] = []

  form.children.forEach((child) => {
    if (
      child.type === FormItemTypes.SECTION &&
      shouldShowFormItem(child, answers, externalData)
    ) {
      sections.push({
        ...(child as Section),
        children: child.children.filter((sectionChild) =>
          shouldShowFormItem(sectionChild, answers, externalData),
        ),
      })
    }
  })

  return sections
}
