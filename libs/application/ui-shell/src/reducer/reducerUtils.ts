import get from 'lodash/get'
import isArray from 'lodash/isArray'
import {
  findSectionIndex,
  findSubSectionIndex,
  getSectionsInForm,
  getSubSectionsInSection,
  getValueViaPath,
  isValidScreen,
  shouldShowFormItem,
} from '@island.is/application/core'
import {
  ExternalData,
  ExternalDataProvider,
  Field,
  Form,
  FormItemTypes,
  FieldTypes,
  FormLeaf,
  FormNode,
  FormValue,
  MultiField,
  Repeater,
  Section,
  SubSection,
} from '@island.is/application/types'

import {
  ExternalDataProviderScreen,
  FieldDef,
  FormScreen,
  MultiFieldScreen,
  RepeaterScreen,
} from '../types'
import { answerIsMissing } from '../utils'
import { User } from 'user'

export const screenRequiresAnswer = (screen: FormScreen) => {
  if (!screen.isNavigable) {
    return false
  }

  if (screen.type === FormItemTypes.REPEATER) {
    return true
  } else if (screen.type === FormItemTypes.MULTI_FIELD) {
    let screensThatRequireAnswer = 0

    for (const subScreen of screen.children) {
      if (screenRequiresAnswer(subScreen)) {
        screensThatRequireAnswer += 1
      }
    }

    return screensThatRequireAnswer > 0
  }

  const doesNotRequireAnswer = get(screen, 'doesNotRequireAnswer') === true
  return !doesNotRequireAnswer
}

export const screenHasBeenAnswered = (
  screen: FormScreen,
  answers: FormValue,
  checkIfPartlyAnswered = false,
) => {
  if (!screenRequiresAnswer(screen)) {
    return true
  }

  if (!screen.id) {
    return false
  }

  const answer = getValueViaPath(answers, screen.id)
  const answerHasValue = !answerIsMissing(answer)

  if (screen.type === FormItemTypes.REPEATER) {
    // We do not need to check all individual screens here like we do
    // with multi field since the screens are rendered individually
    // and will be checked individually
    return isArray(answer) && answer.length > 0
  } else if (screen.type === FormItemTypes.MULTI_FIELD) {
    let numberOfAnswers = 0
    let numberOfRequiredAnswers = 0

    for (const subScreen of screen.children) {
      const requiresAnswer = screenRequiresAnswer(subScreen)
      const hasBeenAnswered = screenHasBeenAnswered(subScreen, answers)

      if (requiresAnswer) {
        numberOfRequiredAnswers += 1

        // Only count answers where they are required
        if (hasBeenAnswered) {
          numberOfAnswers += 1
        }
      }
    }

    if (checkIfPartlyAnswered) {
      return numberOfAnswers > 0
    }

    return numberOfAnswers === numberOfRequiredAnswers
  } else if (
    screen.type === FieldTypes.CUSTOM &&
    screen.childInputIds &&
    screen.childInputIds.length > 0
  ) {
    const hasAnyMissingAnswer = screen.childInputIds.some((childInputId) => {
      const childAnswer = getValueViaPath(answers, childInputId)
      const missingChildAnswer = answerIsMissing(childAnswer)

      return missingChildAnswer
    })

    return !hasAnyMissingAnswer
  }

  return answerHasValue
}

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

    // If we reach here we know that this screen requires an answer
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
  user: User | null,
): FieldDef {
  return {
    ...field,
    isNavigable:
      isParentNavigable &&
      shouldShowFormItem(field as Field, answers, externalData, user),
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
  user: User | null,
): ExternalDataProviderScreen {
  return {
    ...externalDataProvider,
    isNavigable:
      isParentNavigable &&
      shouldShowFormItem(externalDataProvider, answers, externalData, user),
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
  user: User | null,
): MultiFieldScreen {
  let isMultiFieldVisible = false
  const children: FieldDef[] = []

  multiField.children.forEach((field) => {
    const isFieldVisible = shouldShowFormItem(
      field,
      answers,
      externalData,
      user,
    )

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
  user: User | null,
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
          user,
        ),
      )
    })
  }

  return [
    {
      ...repeater,
      isNavigable:
        isParentNavigable &&
        shouldShowFormItem(repeater, answers, externalData, user),
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
  user: User | null,
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
        user,
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
      user,
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
        user,
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
      user,
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
  user: User | null,
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
      user,
    )
  }

  let screens: FormScreen[] = []
  let newScreens: FormScreen[] = []

  if (children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const sections = getSectionsInForm(form, answers, externalData, user)

      if (child.type === FormItemTypes.SECTION) {
        subSectionIndex = -1
        sectionIndex = findSectionIndex(sections, child as Section)
      } else if (child.type === FormItemTypes.SUB_SECTION) {
        const section = sections[sectionIndex]

        const subSections = getSubSectionsInSection(
          section,
          answers,
          externalData,
          user,
        )

        subSectionIndex =
          !section || sectionIndex === -1
            ? -1
            : findSubSectionIndex(subSections, child as SubSection)
      }

      const shouldBeVisible = shouldShowFormItem(
        child,
        answers,
        externalData,
        user,
      )

      newScreens = convertFormNodeToScreens(
        child,
        answers,
        externalData,
        form,
        isParentNavigable && shouldBeVisible,
        sectionIndex,
        subSectionIndex,
        user,
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
  user: User | null,
): FormScreen[] {
  return convertFormNodeToScreens(
    form,
    answers,
    externalData,
    form,
    true,
    -1,
    -1,
    user,
  )
}

export function getNavigableSectionsInForm(
  form: Form,
  answers: FormValue,
  externalData: ExternalData,
  user: User | null,
): Section[] {
  const sections: Section[] = []

  form.children.forEach((child) => {
    if (
      child.type === FormItemTypes.SECTION &&
      shouldShowFormItem(child, answers, externalData, user)
    ) {
      sections.push({
        ...(child as Section),
        children: child.children.filter((sectionChild) =>
          shouldShowFormItem(sectionChild, answers, externalData, user),
        ),
      })
    }
  })

  return sections
}
