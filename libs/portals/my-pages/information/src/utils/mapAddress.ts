import { HmsContractProperty } from '@island.is/api/schema'

export const generateRentalAgreementAddress = (
  property?: HmsContractProperty,
) => {
  if (
    !property ||
    (!property.streetAndHouseNumber &&
      !property.postalCode &&
      !property.municipality)
  )
    return undefined

  let str = ''

  if (property.streetAndHouseNumber) {
    str += `${property.streetAndHouseNumber}, `
  }

  if (property.postalCode) {
    str += `${property.postalCode} `
  }

  if (property.municipality) {
    str += `${property.municipality}`
  }

  return str
}
