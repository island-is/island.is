import deepmerge from 'deepmerge'
import isArray from 'lodash/isArray'

import { Field } from '../types/Fields'
import { Application, FormValue } from '../types/Application'
import {
  Form,
  FormItemTypes,
  FormLeaf,
  FormNode,
  FormText,
  FormTextArray,
  Section,
  StaticText,
  SubSection,
} from '../types/Form'

const containsArray = (obj: Record<string, any>) => {
  let contains = false

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && isArray(obj[key])) {
      contains = true
    }
  }

  return contains
}

export function getValueViaPath(
  obj: Record<string, any>,
  path: string,
  defaultValue: unknown = undefined,
): unknown | undefined {
  // Errors from dataSchema with array of object looks like e.g. `{ 'periods[1].startDate': 'error message' }`
  if (path.match(/.\[\d\]\../g) && !containsArray(obj)) {
    return obj?.[path]
  }

  // For the rest of the case, we are into e.g. `personalAllowance.usePersonalAllowance`
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

type DeepmergeOptions = deepmerge.Options & {
  cloneUnlessOtherwiseSpecified(
    key: Record<string, any>,
    options?: DeepmergeOptions,
  ): any | undefined
  isMergeableObject(item: Record<string, any>): boolean
}

const overwriteArrayMerge = (
  destinationArray: Record<string, any>[],
  sourceArray: Record<string, any>[],
  options: DeepmergeOptions,
) => {
  const destination = destinationArray.slice()

  if (
    typeof sourceArray[sourceArray.length - 1] !== 'object' ||
    sourceArray.length < destinationArray.length // an element was removed
  ) {
    return sourceArray
  }

  sourceArray.forEach((item: Record<string, any>, index: number) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
    } else if (options.isMergeableObject(item)) {
      destination[index] = deepmerge(destinationArray[index], item, options)
    } else if (destinationArray.indexOf(item) === -1) {
      destination.push(item)
    }
  })

  return destination
}

export function mergeAnswers(
  currentAnswers: Record<string, any>,
  newAnswers: Record<string, any>,
): FormValue {
  return deepmerge(currentAnswers, newAnswers, {
    arrayMerge: overwriteArrayMerge,
  })
}

export type MessageFormatter = (descriptor: StaticText, values?: any) => string

type ValueOf<T> = T[keyof T]

export function formatText<T extends FormTextArray | FormText>(
  text: T,
  application: Application,
  formatMessage: MessageFormatter,
): T extends FormTextArray ? string[] : string {
  const handleMessageFormatting = (message: StaticText) => {
    if (typeof message === 'string') {
      return formatMessage(message)
    }

    const { values = {}, ...descriptor } = message

    return formatMessage(descriptor, values)
  }

  if (typeof text === 'function') {
    const message = (text as (_: Application) => StaticText | StaticText[])(
      application,
    )
    if (Array.isArray(message)) {
      return message.map((m) =>
        handleMessageFormatting(m),
      ) as T extends FormTextArray ? string[] : string
    }
    return handleMessageFormatting(message) as T extends FormTextArray
      ? string[]
      : string
  }
  return formatMessage(text) as T extends FormTextArray ? string[] : string
}

// periods[3].startDate -> 3
// notPartOfRepeater -> -1
// periods[5ab33f1].id -> -1
export function extractRepeaterIndexFromField(field: Field): number {
  if (!field.isPartOfRepeater) {
    return -1
  }
  let repeaterIndex = ''
  let foundBracketOpen = false
  for (let i = 0; i < field.id.length; i++) {
    const char = field.id.charAt(i)
    if (char === ']') {
      break
    }
    if (!foundBracketOpen && char === '[') {
      foundBracketOpen = true
    } else if (foundBracketOpen) {
      const partOfIndex = parseInt(char, 10)
      if (isNaN(partOfIndex)) {
        return -1
      }
      repeaterIndex += char
    }
  }
  if (repeaterIndex.length) {
    return parseInt(repeaterIndex, 10)
  }
  return -1
}
