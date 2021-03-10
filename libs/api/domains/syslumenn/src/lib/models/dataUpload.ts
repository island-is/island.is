export type DataUpload = {
  id: string
  data: {
    id: string
    name: string
    person: [Person]
    attachments: [Attachment]
  }
}

export enum PersonType {
  Plaintiff,
  CounterParty,
  Child,
}

export type Person = {
  name: string
  ssn: string
  phoneNumber?: string
  email?: string
  homeAddress: string
  postalCode: string
  city: string
  signed: boolean
  type: PersonType
}

export type Attachment = {
  name: string
  content: string
}
