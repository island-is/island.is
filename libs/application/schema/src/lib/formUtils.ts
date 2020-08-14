import { FormNode, FormLeaf } from '../types/Form'
import { Form, FormItemTypes, Section, SubSection } from '../types/Form'
import { Question } from '../types/Fields'

export function findNode(
  id: string,
  type: FormItemTypes,
  formNode: FormNode,
): FormNode {
  if (id === formNode.id && type === formNode.type) {
    return formNode
  }
  const { children } = formNode
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const foundNode = findNode(id, type, children[i])
      if (foundNode) {
        return foundNode
      }
    }
  }
  return undefined
}
const isValidScreen = (node: FormNode): boolean => {
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

export const getFormNodeLeaves = (
  node: FormNode,
  onlyQuestions = false,
): FormLeaf[] => {
  const { children } = node
  if (isValidScreen(node)) {
    if (onlyQuestions && 'isQuestion' in node && node.isQuestion) {
      return [node as FormLeaf]
    } else if (!onlyQuestions) {
      return [node as FormLeaf]
    }
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

export const getFormLeaves = (form: Form): FormLeaf[] => {
  return getFormNodeLeaves(form)
}

export const getQuestionsForFormNode = (
  node: FormNode,
): { [key: string]: Question } => {
  const questions = getFormNodeLeaves(node, true) as Question[]
  const questionMap = {}
  questions.forEach((question) => {
    questionMap[question.id] = question
  })
  return questionMap
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

export function findSectionIndexForScreen(
  form: Form,
  screen: FormLeaf,
): number {
  const sections = getSectionsInForm(form)
  if (!sections.length) {
    return -1
  }
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const screensInSection = getFormNodeLeaves(section)
    if (screensInSection.find(({ id }) => id === screen.id) !== undefined) {
      return i
    }
  }
  return -1
}

export function findSubSectionIndexForScreen(
  section: Section,
  screen: FormLeaf,
): number {
  const subSections = getSubSectionsInSection(section)
  if (!subSections.length) {
    return -1
  }
  for (let i = 0; i < subSections.length; i++) {
    const subSection = subSections[i]
    const screensInSection = getFormNodeLeaves(subSection)
    if (screensInSection.find(({ id }) => id === screen.id) !== undefined) {
      return i
    }
  }
  return -1
}
