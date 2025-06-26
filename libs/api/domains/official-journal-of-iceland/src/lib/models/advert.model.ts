import { AdvertStatus } from '@island.is/clients/official-journal-of-iceland'
import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(AdvertStatus, {
  name: 'OfficialJournalOfIcelandAdvertStatus',
})

@ObjectType('OfficialJournalOfIcelandAdvertMainCategory')
export class AdvertMainCategory {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  slug!: string

  @Field(() => String)
  description!: string

  @Field(() => [AdvertCategory])
  categories!: AdvertCategory[]

  @Field(() => String)
  departmentId?: string
}

@ObjectType('OfficialJournalOfIcelandAdvertCategory')
export class AdvertCategory {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  slug!: string

  @Field(() => AdvertEntity, { nullable: true })
  department?: AdvertEntity | null

  @Field(() => AdvertMainCategory, { nullable: true })
  mainCategory?: AdvertMainCategory | null
}

@ObjectType('OfficialJournalOfIcelandAdvertCorrections')
export class AdvertCorrections {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  advertId!: string

  @Field(() => String, { nullable: true })
  documentPdfUrl?: string

  @Field(() => Boolean, { nullable: true })
  isLegacy?: boolean | null

  @Field(() => String, { nullable: true })
  legacyDate?: string | null

  @Field(() => String)
  createdDate!: string

  @Field(() => String)
  updatedDate!: string
}

@ObjectType('OfficialJournalOfIcelandAdvertAppendix')
export class AdvertAppendix {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  html!: string

  @Field(() => Number, { nullable: true })
  order?: number | null
}

@ObjectType('OfficialJournalOfIcelandAdvertEntity')
export class AdvertEntity {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  slug!: string
}

@ObjectType('OfficialJournalOfIcelandAdvertDocument')
export class AdvertDocument {
  @Field(() => Boolean)
  isLegacy!: boolean

  @Field(() => String)
  html!: string | null

  @Field(() => String, { nullable: true })
  pdfUrl?: string | null
}

@ObjectType('OfficialJournalOfIcelandAdvertPublicationNumber')
export class AdvertPublicationNumber {
  @Field(() => Int)
  number!: number

  @Field(() => Int)
  year!: number

  @Field(() => String)
  full!: string
}

@ObjectType('OfficialJournalOfIcelandAdvertType')
export class AdvertType {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  slug!: string

  @Field(() => AdvertEntity, { nullable: true })
  department!: AdvertEntity | null
}

@ObjectType('OfficialJournalOfIcelandAdvert')
export class Advert {
  @Field(() => ID)
  id!: string

  @Field(() => AdvertEntity)
  department!: AdvertEntity

  @Field(() => AdvertType)
  type!: AdvertType

  @Field(() => String)
  subject?: string

  @Field(() => String)
  title!: string

  @Field(() => AdvertStatus)
  status!: AdvertStatus

  @Field(() => AdvertPublicationNumber)
  publicationNumber!: AdvertPublicationNumber | null

  @Field(() => String)
  createdDate!: string

  @Field(() => String)
  updatedDate!: string

  @Field(() => String)
  signatureDate!: string | null

  @Field(() => String)
  publicationDate!: string | null

  @Field(() => [AdvertEntity])
  categories!: AdvertCategory[]

  @Field(() => AdvertEntity)
  involvedParty!: AdvertEntity

  @Field(() => AdvertDocument)
  document!: AdvertDocument

  @Field(() => [AdvertCorrections], { nullable: true })
  corrections?: AdvertCorrections[]

  @Field(() => [AdvertAppendix], { nullable: true })
  additions?: AdvertAppendix[]
}

@ObjectType('OfficialJournalOfIcelandAdvertSimilar')
export class AdvertSimilar {
  @Field(() => ID)
  id!: string

  @Field(() => AdvertEntity)
  department!: AdvertEntity

  @Field(() => String)
  subject?: string

  @Field(() => String)
  title!: string

  @Field(() => AdvertPublicationNumber)
  publicationNumber!: AdvertPublicationNumber | null

  @Field(() => String)
  publicationDate!: string | null

  @Field(() => [AdvertEntity])
  categories!: AdvertCategory[]

  @Field(() => AdvertEntity)
  involvedParty!: AdvertEntity
}

@ObjectType('OfficialJournalOfIcelandAdvertsMainType')
export class AdvertMainType {
  @Field()
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field(() => AdvertEntity)
  department!: AdvertEntity

  @Field(() => [AdvertType])
  types!: AdvertType[]
}
