export type Children = {
  fullName: string
  nationalId: string
  otherParent: object
}

export type Person = {
  nationalId: string
  fullName: string
  email: string
  phoneNumber: string
  address: {
    streetAddress: string
    postalCode: string
    city: string
  }
}
