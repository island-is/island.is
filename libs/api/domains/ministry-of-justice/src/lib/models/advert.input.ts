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

@InputType('MinistryOfJusticeQueryInput')
export class QueryParams {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => String, { nullable: true })
  page?: number
}
