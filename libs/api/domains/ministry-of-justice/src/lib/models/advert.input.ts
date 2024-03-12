import { InputType, Field } from '@nestjs/graphql'

@InputType('MinistryOfJusticeAdvertsInput')
export class AdvertsInput {
  @Field(() => String, { nullable: true })
  search?: string
}

@InputType('MinistryOfJusticeTypesInput')
export class TypeQueryParams {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => String, { nullable: true })
  department?: string

  @Field(() => String, { nullable: true })
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

  @Field(() => String, { nullable: true })
  page?: number
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

  @Field(() => String, { nullable: true })
  signature!: null
}
