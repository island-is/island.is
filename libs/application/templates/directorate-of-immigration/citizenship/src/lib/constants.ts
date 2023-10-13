import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT | DefaultEvents.ABORT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  PAYMENT = 'payment',
  IN_REVIEW = 'inReview',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum Routes {
  USERINFORMATION = 'userInformation',
  PICKCHILDREN = 'pickChildren',
  PICKCHILDRENEXTRA = 'pickChildrenExtra',
  PARENTINFORMATION = 'parentInformation',
  MARITALSTATUS = 'maritalStatus',
  COUNTRIESOFRESIDENCE = 'countriesOfResidence',
  STAYSABROAD = 'staysAbroad',
  PASSPORT = 'passport',
  CHILDRENPASSPORT = 'childrenPassport',
  SUPPORTINGDOCUMENTS = 'supportingDocuments',
  CHILDSUPPORTINGDOCUMENTS = 'childrenSupportingDocuments',
}
