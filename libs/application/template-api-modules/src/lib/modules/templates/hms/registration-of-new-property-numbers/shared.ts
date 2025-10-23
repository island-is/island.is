import { ApplicantType } from '@island.is/clients/hms-application-system'

export const APPLICATION_TYPE = 'Yp3tK7qWb9Rmx2DJFc4Lza'

export enum NotandagognFlokkur {
  ApplicationSubmission = 'Skil á umsókn',
  Property = 'Eign',
  DerivedPropertyNumber = 'FastanúmerAfleiða',
}

export enum NotandagognTegund {
  Boolean = 'bool',
  String = 'string',
  PropertyNumber = 'fastanúmer',
}

export enum NotandagognHeiti {
  DeclarationOfPropertyNumberRegistrationAwareness = 'Ég hef kynnt mér efnið á island.is um stofnun fasteignanúmera',
  PrivacyPolicyAcknowledgement = 'Ég hef kynnt mér persónuverndarstefnu HMS',
  PropertyNumber = 'Fasteignanúmer',
  OtherComments = 'Aðrar athugasemdir',
}

export const Tegund = {
  Person: ApplicantType.NUMBER_0,
  Company: ApplicantType.NUMBER_2,
} as const

export enum Hlutverk {
  Applicant = 'Umsækjandi',
  Contact = 'Tengiliður',
}

export interface EmailRecipient {
  nationalId: string
  name: string
  email?: string
}

export type RealEstateAnswers = {
  realEstateName: string
  realEstateAmount: string
  realEstateCost: string
  realEstateOtherComments?: string | undefined
}

export type ContactAnswer = {
  isSameAsApplicant?: string[] | undefined
  email?: string | null | undefined
  name?: string | null | undefined
  phone?: string | null | undefined
}
