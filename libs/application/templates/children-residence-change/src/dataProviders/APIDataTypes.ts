export interface PersonResidenceChange {
  id: string
  name: string
  ssn: string
  postalCode: string
  address: string
  city: string
}

export interface ParentResidenceChange extends PersonResidenceChange {
  phoneNumber: string | undefined
  email: string | undefined
}
