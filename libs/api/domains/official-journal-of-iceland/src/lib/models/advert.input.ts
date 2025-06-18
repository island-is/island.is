import { AdvertSignatureType } from '@island.is/clients/official-journal-of-iceland'
import { InputType, Field, registerEnumType, Int } from '@nestjs/graphql'

registerEnumType(AdvertSignatureType, {
  name: 'OfficialJournalOfIcelandAdvertSignatureType',
})

@InputType('OfficialJournalOfIcelandAdvertsInput')
export class AdvertsInput {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => Int, { nullable: true })
  pageSize?: number

  @Field(() => [String], { nullable: true })
  department?: string[]

  @Field(() => [String], { nullable: true })
  type?: string[]

  @Field(() => [String], { nullable: true })
  category?: string[]

  @Field(() => [String], { nullable: true })
  involvedParty?: string[]

  @Field(() => String, { nullable: true })
  dateFrom?: string

  @Field(() => String, { nullable: true })
  dateTo?: string
}

@InputType('OfficialJournalOfIcelandTypesInput')
export class TypeQueryParams {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => String, { nullable: true })
  department?: string

  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => Int, { nullable: true })
  pageSize?: number
}

@InputType('OfficialJournalOfIcelandAdvertSingleParams')
export class AdvertSingleParams {
  @Field(() => String)
  id!: string
}

@InputType('OfficialJournalOfIcelandAdvertSimilarParams')
export class AdvertSimilarParams {
  @Field(() => String)
  id!: string
}

@InputType('OfficialJournalOfIcelandQueryInput')
export class QueryParams {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => Int, { nullable: true })
  pageSize?: number
}

@InputType('OfficialJournalOfIcelandAdvertSignatureMember')
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
@InputType('OfficialJournalOfIcelandAdvertSignatureData')
export class AdvertSignatureData {
  @Field(() => String)
  institution!: string

  @Field(() => String)
  date!: string

  @Field(() => [AdvertSignatureMember])
  members!: AdvertSignatureMember[]
}
@InputType('OfficialJournalOfIcelandAdvertSignature')
export class AdvertSignature {
  @Field(() => AdvertSignatureType)
  type!: AdvertSignatureType

  @Field(() => String, { nullable: true })
  additional?: string

  @Field(() => [AdvertSignatureData])
  data!: AdvertSignatureData[]
}

@InputType('OfficialJournalOfIcelandSubmitApplicationInput')
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

@InputType('OfficialJournalOfIcelandMainTypesInput')
export class MainTypesQueryParams {
  @Field(() => String, { nullable: true })
  department?: string

  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => Int, { nullable: true })
  pageSize?: number
}
