import { ApplicantType } from '@island.is/clients/hms-application-system'

export const APPLICATION_TYPE = 'Yp3tK7qWb9Rmx2DJFc4Lza'
export const APPLICATION_NAME = 'Stofnun nýrra fasteignanúmera'
export const formatCurrency = (answer: string) =>
  answer.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export enum NotandagognFlokkur {
  Product = 'Vara',
  OtherInformation = 'Aðrar upplýsingar',
  CoreInformation = 'Stofnupplýsingar',
  Payment = 'Greiðsla',
  Contact = 'Tengiliður',
}

export enum NotandagognTegund {
  Boolean = 'bool',
  String = 'string',
  PropertyNumber = 'fastanúmer',
}

export enum NotandagognHeiti {
  PropertyNumber = 'Fasteignanúmer upprunaeignar',
  OtherComments = 'Annað sem á að koma fram',
  LandId = 'Landnúmer',
  DocumentNumber = 'Skjalategund',
  AmountOfNewNumbers = 'Fjöldi nýrra númera',
  AmountPaid = 'Upphæð til greiðslu',
  Applicant = 'Málsaðili',
  Registrant = 'Skráningaraðili',
  Name = 'Nafn',
  Phone = 'Sími',
  Email = 'Netfang',
}

export const Tegund = {
  Person: ApplicantType.NUMBER_0,
  Company: ApplicantType.NUMBER_2,
} as const

export enum Hlutverk {
  Customer = 'Viðskiptavinur',
  Contact = 'Tengiliður',
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
