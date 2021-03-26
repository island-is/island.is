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

interface ChildrenResidenceInfo {
  parent: {
    letter: 'A' | 'B'
    name: string
  }
  address: Address
}

const extractParentInfo = (
  { address, fullName }: NationalRegistry | PersonResidenceChange,
  letter: 'A' | 'B',
): ChildrenResidenceInfo => {
  return {
    address,
    parent: {
      name: fullName,
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
    answers.selectChild,
  )
  const parentB = children[0].otherParent
  const childrenLiveWithApplicant = children.some(
    (child) => child.livesWithApplicant,
  )

  return {
    current: childrenLiveWithApplicant
      ? extractParentInfo(applicant, 'A')
      : extractParentInfo(parentB, 'B'),
    future: childrenLiveWithApplicant
      ? extractParentInfo(parentB, 'B')
      : extractParentInfo(applicant, 'A'),
  }
}
