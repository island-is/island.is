import { Address } from '../types'

export const constructParentAddressString = (address: Address) => {
  if (!address) {
    return null
  }
  return `${address?.streetName}, ${address?.postalCode} ${address?.city}`
}
