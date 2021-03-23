import { PersonResidenceChange } from '../types'

export const constructParentAddressString = (parent: PersonResidenceChange) => {
  if (!parent) {
    return null
  }
  return `${parent?.address}, ${parent?.postalCode} ${parent?.city}`
}
