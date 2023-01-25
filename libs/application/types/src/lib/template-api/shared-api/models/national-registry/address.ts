export interface Address {
  streetAddress: string | null
  postalCode: string | null
  locality: string | null
  /** @deprecated */
  city: string | null
  municipalityCode: string | null
}
