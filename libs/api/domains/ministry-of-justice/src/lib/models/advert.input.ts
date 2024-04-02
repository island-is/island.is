import { InputType, Field, registerEnumType } from '@nestjs/graphql'

export enum JournalSignatureBodyTypeEnum {
  Hefbundin = 'Hefðbundin',
  Nefnd = 'Nefnd',
}

registerEnumType(JournalSignatureBodyTypeEnum, {
  name: 'MinistryOfJusticeAdvertSignatureType',
})

@InputType('MinistryOfJusticeAdvertsInput')
export class AdvertsInput {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => Number, { nullable: true })
  page?: number

  @Field(() => [String], { nullable: true })
  department?: string[]

  @Field(() => [String], { nullable: true })
  type?: string[]

  @Field(() => [String], { nullable: true })
  category?: string[]

  @Field(() => [String], { nullable: true })
  involvedParty?: string[]

  @Field(() => Date, { nullable: true })
  dateFrom?: string

  @Field(() => Date, { nullable: true })
  dateTo?: string
}

@InputType('MinistryOfJusticeTypesInput')
export class TypeQueryParams {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => String, { nullable: true })
  department?: string

  @Field(() => Number, { nullable: true })
  page?: number
}

@InputType('MinistryOfJusticeAdvertQuery')
export class AdvertQueryParams {
  @Field(() => String)
  id!: string
}

@InputType('MinistryOfJusticeQueryInput')
export class QueryParams {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => Number, { nullable: true })
  page?: number
}

@InputType('MinistryOfJusticeAdvertSignatureMember')
export class AdvertSignatureMember {
  @Field(() => Boolean)
  isChairman!: boolean

  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  textAbove?: string

  @Field(() => String, { nullable: true })
  textAfter?: string

  @Field(() => String, { nullable: true })
  textBelow?: string
}
@InputType('MinistryOfJusticeAdvertSignatureData')
export class AdvertSignatureData {
  @Field(() => String)
  institution!: string

  @Field(() => String)
  date!: string

  @Field(() => [AdvertSignatureMember])
  members!: AdvertSignatureMember[]
}
@InputType('MinistryOfJusticeAdvertSignature')
export class AdvertSignature {
  @Field(() => JournalSignatureBodyTypeEnum)
  type!: JournalSignatureBodyTypeEnum

  @Field(() => String, { nullable: true })
  additional?: string

  @Field(() => [AdvertSignatureData])
  data!: AdvertSignatureData[]
}

@InputType('MinistryOfJusticeSubmitApplicationInput')
export class SubmitApplicationInput {
  @Field(() => String)
  applicationId!: string

  @Field(() => String)
  department!: string

  @Field(() => String)
  type!: string

  @Field(() => [String])
  categories!: string[]

  @Field(() => String)
  subject!: string

  @Field(() => String)
  requestedPublicationDate!: string

  @Field(() => String)
  document!: string

  @Field(() => AdvertSignature)
  signature!: AdvertSignature
}
