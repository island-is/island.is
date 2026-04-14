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
  FormItemTypes,
  FormLeaf,
  FormNode,
  FormValue,
  Form,
  MultiField,
  Repeater,
  Section,
  SubSection,
} from '@island.is/application/types'
import { BffUser } from '@island.is/shared/types'

import {
  ExternalDataProviderScreen,
  FieldDef,
  FormScreen,
  MultiFieldScreen,
  RepeaterScreen,
} from './types'

const convertFieldToScreen = (
  field: Field,
  answers: FormValue,
  externalData: ExternalData,
  isParentNavigable = true,
  sectionIndex: number,
  subSectionIndex: number,
  user: BffUser | null,
): FieldDef => {
  return {
    ...field,
    isNavigable:
      isParentNavigable &&
      shouldShowFormItem(field as Field, answers, externalData, user),
    sectionIndex,
    subSectionIndex,
  } as FieldDef
}

const convertDataProviderToScreen = (
  externalDataProvider: ExternalDataProvider,
  answers: FormValue,
  externalData: ExternalData,
  isParentNavigable = true,
  sectionIndex: number,
  subSectionIndex: number,
  user: BffUser | null,
): ExternalDataProviderScreen => {
  return {
    ...externalDataProvider,
    isNavigable:
      isParentNavigable &&
      shouldShowFormItem(externalDataProvider, answers, externalData, user),
    sectionIndex,
    subSectionIndex,
  }
}

export const convertMultiFieldToScreen = (
  multiField: MultiField,
  answers: FormValue,
  externalData: ExternalData,
  isParentNavigable = true,
  sectionIndex: number,
  subSectionIndex: number,
  user: BffUser | null,
): MultiFieldScreen => {
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

const convertRepeaterToScreens = (
  repeater: Repeater,
  answers: FormValue,
  externalData: ExternalData,
  isParentNavigable = true,
  sectionIndex: number,
  subSectionIndex: number,
  user: BffUser | null,
): FormScreen[] => {
  const { id, children } = repeater
  const newScreens: FormScreen[] = []

  const recursiveMap = (
    field: FormLeaf,
    fn: (l: FormLeaf) => FormLeaf,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any => {
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

const convertLeafToScreens = (
  leaf: FormLeaf,
  answers: FormValue,
  externalData: ExternalData,
  isParentNavigable = true,
  sectionIndex: number,
  subSectionIndex: number,
  user: BffUser | null,
): FormScreen[] => {
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

const convertFormNodeToScreens = (
  formNode: FormNode,
  answers: FormValue,
  externalData: ExternalData,
  form: Form,
  isParentNavigable: boolean,
  sectionIndex: number,
  subSectionIndex: number,
  user: BffUser | null,
): FormScreen[] => {
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

export const convertFormToScreens = (
  form: Form,
  answers: FormValue,
  externalData: ExternalData,
  user: BffUser | null,
): FormScreen[] => {
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

export const getNavigableSectionsInForm = (
  form: Form,
  answers: FormValue,
  externalData: ExternalData,
  user: BffUser | null,
): Section[] => {
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
