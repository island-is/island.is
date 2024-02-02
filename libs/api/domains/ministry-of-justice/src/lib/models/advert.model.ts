import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum AdvertDepartment {
  ADeild = 'A deild',
  BDeild = 'B deild',
  CDeild = 'C deild',
  Unknown = 'Óþekkt',
}

export enum AdvertStatus {
  Active = 'Virk',
  Revoked = 'Afturkölluð',
  Draft = 'Drög',
  Old = 'Eldri auglýsing',
  Rejected = 'Hafnað',
  Waiting = 'Í bið',
  InProgress = 'Í vinnslu',
  Submitted = 'Innsend',
  ReadyForPublication = 'Tilbúin til útgáfu',
  Published = 'Útgefin',
  Unknown = 'Óþekkt',
}

registerEnumType(AdvertDepartment, {
  name: 'MinistryOfJusticeAdvertDepartment',
})

registerEnumType(AdvertStatus, {
  name: 'MinistryOfJusticeAdvertStatus',
})

@ObjectType('MinistryOfJusticeAdvertCategory')
export class AdvertCategory {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  slug!: string
}

@ObjectType('MinistryOfJusticeAdvertDocument')
export class AdvertDocument {
  @Field(() => Boolean)
  isLegacy!: boolean

  @Field(() => String, { nullable: true })
  html!: string | null

  @Field(() => String, { nullable: true })
  pdfUrl!: string | null
}

@ObjectType('MinistryOfJusticeAdvertInvolvedParty')
export class AdvertInvolvedParty {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string
}

@ObjectType('MinistryOfJusticeAdvertPublicationNumber')
export class AdvertPublicationNumber {
  @Field(() => Int)
  number!: number

  @Field(() => Int)
  year!: number

  @Field(() => String)
  full!: string
}

@ObjectType('MinistryOfJusticeAdvert')
export class Advert {
  @Field(() => ID)
  id!: string

  @Field(() => AdvertDepartment)
  department!: AdvertDepartment

  @Field(() => String) // will be a enum in the future
  type!: string

  @Field(() => String, { nullable: true })
  subject?: string

  @Field(() => String)
  title!: string

  @Field(() => AdvertStatus)
  status!: AdvertStatus

  @Field(() => AdvertPublicationNumber, { nullable: true })
  publicationNumber?: AdvertPublicationNumber

  @Field(() => String)
  createdDate!: string

  @Field(() => String)
  updatedDate!: string

  @Field(() => String, { nullable: true })
  signatureDate!: string | null

  @Field(() => String, { nullable: true })
  publicationDate!: string | null

  @Field(() => [AdvertCategory])
  categories!: AdvertCategory[]

  @Field(() => AdvertInvolvedParty)
  involvedParty!: AdvertInvolvedParty

  @Field(() => AdvertDocument)
  document!: AdvertDocument
}
