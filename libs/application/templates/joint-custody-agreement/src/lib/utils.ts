import { Child, Person, Address } from '../types'

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

export const getOtherParentInformation = (
  children: Child[],
  selectedChildren: string[],
): Person => {
  const selected = getSelectedChildrenFromExternalData(
    children,
    selectedChildren,
  )
  return selected?.[0]?.otherParent
}
