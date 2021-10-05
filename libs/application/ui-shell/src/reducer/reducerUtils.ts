import get from 'lodash/get'
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
  stopOnFirstMissingAnswer = false,
): number => {
  let currentScreen = 0
  let missingAnswer = false
  let lastAnswerIndex = 0

  for (let index = 0; index < screens.length; ) {
    const screen = screens[index]

    const isNavigable = get(screen, 'isNavigable') === true
    const doesNotRequireAnswer = get(screen, 'doesNotRequireAnswer') === true

    if (!isNavigable || doesNotRequireAnswer) {
      let skipLength = 1

      if (
        screen.type === FormItemTypes.MULTI_FIELD ||
        screen.type === FormItemTypes.REPEATER
      ) {
        skipLength = screen.children.length + 1
      }

      currentScreen = index + skipLength
      index = index + skipLength

      continue
    }

    if (screen.type === FormItemTypes.MULTI_FIELD) {
      let numberOfAnsweredQuestionsInScreen = 0

      for (const subScreen of screen.children) {
        const isSubScreenNavigable = get(subScreen, 'isNavigable') === true
        const subScreenDoesNotRequireAnswer =
          get(subScreen, 'doesNotRequireAnswer') === true
        const subScreenHasBeenAnswered =
          getValueViaPath(answers, subScreen.id) !== undefined

        if (!isSubScreenNavigable || subScreenDoesNotRequireAnswer) {
          numberOfAnsweredQuestionsInScreen++
        } else if (subScreenHasBeenAnswered) {
          numberOfAnsweredQuestionsInScreen++
        } else {
          break
        }
      }

      const answeredAllSubScreens =
        numberOfAnsweredQuestionsInScreen === screen.children.length

      if (answeredAllSubScreens) {
        lastAnswerIndex = index + 1
        currentScreen = index + screen.children.length
      } else {
        // Did not answer all the questions
        currentScreen = index
        lastAnswerIndex = currentScreen
        missingAnswer = true

        if (stopOnFirstMissingAnswer) {
          break
        }
      }
    } else if (screen.type === FormItemTypes.REPEATER) {
      const repeaterHasAnswer =
        getValueViaPath(answers, screen.id) !== undefined

      if (repeaterHasAnswer) {
        lastAnswerIndex = index
        currentScreen = index
      }
    } else if (screen.id) {
      const screenHasBeenAnswered =
        getValueViaPath(answers, screen.id) !== undefined

      if (!screenHasBeenAnswered && stopOnFirstMissingAnswer) {
        currentScreen = index
        break
      }

      if (!screenHasBeenAnswered && index > lastAnswerIndex) {
        missingAnswer = true
      }

      if (!missingAnswer && screenHasBeenAnswered) {
        currentScreen = index + 1
        lastAnswerIndex = index
      }
    }
    index += 1
  }

  const screenIndex = Math.min(currentScreen, screens.length - 1)

  // Check if we jumped over some intro screens in search of the latest answer
  if (screenIndex > lastAnswerIndex) {
    const screen = screens[lastAnswerIndex]

    if (!screen || !screen.id) {
      return screenIndex
    }

    const hasBeenAnswered = getValueViaPath(answers, screen.id) !== undefined
    const requiresAnswer = !get(screen, 'doesNotRequireAnswer')

    if (requiresAnswer && hasBeenAnswered) {
      return lastAnswerIndex + 1
    }

    return lastAnswerIndex
  }

  return screenIndex
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
