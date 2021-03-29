import parse from 'date-fns/parse'
import format from 'date-fns/format'
import {
  Address,
  Answers,
  Child,
  NationalRegistry,
  PersonResidenceChange,
} from '../types'

export const formatAddress = (address: Address) => {
  if (!address) {
    return null
  }
  return `${address.streetName}, ${address.postalCode} ${address.city}`
}

export const getSelectedChildrenFromExternalData = (
  children: Child[],
  selectedChildren: string[],
): Child[] => {
  return children.filter((child) => selectedChildren.includes(child.nationalId))
}

enum ParentLetters {
  A = 'A',
  B = 'B',
}

interface ChildrenResidenceInfo {
  parent: {
    letter: ParentLetters
    fullName: string
  }
  address: Address
}

const extractParentInfo = (
  { address, fullName }: NationalRegistry | PersonResidenceChange,
  letter: ParentLetters,
): ChildrenResidenceInfo => {
  return {
    address,
    parent: {
      fullName,
      letter,
    },
  }
}

export const childrenResidenceInfo = (
  applicant: NationalRegistry,
  answers: Answers,
): {
  current: ChildrenResidenceInfo
  future: ChildrenResidenceInfo
} => {
  const children = getSelectedChildrenFromExternalData(
    applicant.children,
    answers.selectedChildren,
  )
  const parentB = children[0].otherParent
  const childrenLiveWithApplicant = children.some(
    (child) => child.livesWithApplicant,
  )

  return {
    current: childrenLiveWithApplicant
      ? extractParentInfo(applicant, ParentLetters.A)
      : extractParentInfo(parentB, ParentLetters.B),
    future: childrenLiveWithApplicant
      ? extractParentInfo(parentB, ParentLetters.A)
      : extractParentInfo(applicant, ParentLetters.B),
  }
}

export const formatDate = (date: string) => {
  try {
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date())
    return format(parsedDate, 'dd.MM.yyyy')
  } catch {
    return date
  }
}
