export interface CreateHelpdeskInput {
  email?: string
  phoneNumber?: string
}

export interface CreateContactInput {
  name: string
  email: string
  phoneNumber: string
}

export interface CreateOrganisationInput {
  nationalId: string
  name: string
  address: string
  email: string
  phoneNumber: string
  administrativeContact?: CreateContactInput
  technicalContact?: CreateContactInput
  helpdesk?: CreateHelpdeskInput
}
