/**
 * Builds a string in the format "{gata og númer}, {póstnúmer} {staður}" (e.g. "Gervigata 2, 100 Garðabær").
 */
type NationalRegistryAddressFields = {
  street?: { nominative?: string }
  postal_code?: number
  town?: { nominative?: string }
  municipality?: string
}

const trim = (value?: string | null) => value?.trim() ?? ''

export const formatNationalRegistryAddress = (
  address: NationalRegistryAddressFields,
): string | undefined => {
  const street = trim(address.street?.nominative)
  const town = trim(address.town?.nominative)
  const municipality = trim(address.municipality)
  const locality = town || municipality

  const postal =
    address.postal_code !== undefined && address.postal_code !== null
      ? String(address.postal_code)
      : ''

  const postcodeAndLocality = [postal, locality].filter(Boolean).join(' ')
  const streetCommaPostcodeAndLocality = [street, postcodeAndLocality]
    .filter(Boolean)
    .join(', ')

  return streetCommaPostcodeAndLocality || undefined
}
