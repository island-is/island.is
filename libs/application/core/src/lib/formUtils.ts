/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const merge = require('deepmerge')

import { Application, FormValue } from '../types/Application'
import {
  Form,
  FormItemTypes,
  FormLeaf,
  FormNode,
  FormText,
  Section,
  StaticText,
  SubSection,
} from '../types/Form'

export function getValueViaPath(
  obj: {},
  path: string,
  defaultValue: unknown = undefined,
): unknown | undefined {
  try {
    const travel = (regexp: RegExp) =>
      String.prototype.split
        .call(path, regexp)
        .filter(Boolean)
        .reduce(
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          (res, key) => (res !== null && res !== undefined ? res[key] : res),
          obj,
        )
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
    return result === undefined || result === obj ? defaultValue : result
  } catch (e) {
    return undefined
  }
}

export const isValidScreen = (node: FormNode): boolean => {
  switch (node.type) {
    case FormItemTypes.FORM: {
      return false
    }
    case FormItemTypes.SECTION: {
      return false
    }

    case FormItemTypes.SUB_SECTION: {
      return false
    }
    default: {
      return true
    }
  }
}

export const getFormNodeLeaves = (node: FormNode): FormLeaf[] => {
  const { children } = node
  if (isValidScreen(node)) {
    return [node as FormLeaf]
  }

  let leaves: FormLeaf[] = []
  let newLeaves: FormLeaf[] = []
  if (children) {
    for (let i = 0; i < children.length; i++) {
      newLeaves = getFormNodeLeaves(children[i])
      if (newLeaves.length) {
        leaves = [...leaves, ...newLeaves]
      }
    }
  }
  return leaves
}

export function getSectionsInForm(form: Form): Section[] {
  const sections: Section[] = []
  form.children.forEach((child) => {
    if (child.type === FormItemTypes.SECTION) {
      sections.push(child as Section)
    }
  })
  return sections
}
export function getSubSectionsInSection(section: Section): SubSection[] {
  const subSections: SubSection[] = []
  section.children.forEach((child) => {
    if (child.type === FormItemTypes.SUB_SECTION) {
      subSections.push(child as SubSection)
    }
  })
  return subSections
}

export function findSectionIndex(form: Form, section: Section): number {
  const sections = getSectionsInForm(form)
  if (!sections.length) {
    return -1
  }
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].id === section.id) {
      return i
    }
  }
  return -1
}

export function findSubSectionIndex(
  form: Form,
  sectionIndex: number,
  subSection: SubSection,
): number {
  if (sectionIndex === -1) {
    return -1
  }
  const sections = getSectionsInForm(form)
  const section = sections[sectionIndex]
  if (!section) {
    return -1
  }
  const subSections = getSubSectionsInSection(section)
  for (let i = 0; i < subSections.length; i++) {
    if (subSections[i].id === subSection.id) {
      return i
    }
  }
  return -1
}

const overwriteArrayMerge = (
  destinationArray: unknown[],
  sourceArray: unknown[],
) => {
  if (
    typeof sourceArray[sourceArray.length - 1] !== 'object' ||
    sourceArray.length < destinationArray.length // an element was removed
  ) {
    return sourceArray
  }
  const result = []
  for (
    let i = 0;
    i < Math.max(destinationArray.length, sourceArray.length);
    i++
  ) {
    result[i] = merge(sourceArray[i] ?? {}, destinationArray[i] ?? {}, {
      arrayMerge: overwriteArrayMerge,
    })
  }

  return result
}

export function mergeAnswers(
  currentAnswers: object,
  newAnswers: object,
): FormValue {
  return merge(currentAnswers, newAnswers, {
    arrayMerge: overwriteArrayMerge,
  })
}
type MessageFormatter = (descriptor: StaticText, values?: any) => string

export function formatText(
  text: FormText,
  application: Application,
  formatMessage: MessageFormatter,
): string {
  if (typeof text === 'function') {
    const message = text(application)

    if (typeof message === 'string') return formatMessage(message)

    const { values = {}, ...descriptor } = message

    return formatMessage(descriptor, values)
  }
  return formatMessage(text)
}
