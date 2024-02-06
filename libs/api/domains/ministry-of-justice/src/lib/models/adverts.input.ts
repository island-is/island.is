import { InputType, Field } from '@nestjs/graphql'

@InputType('MinistryOfJusticeAdvertsInput')
export class AdvertsInput {
  @Field(() => String, { nullable: true })
  search?: string
}

@InputType('MinistryOfJusticeTypesInput')
export class TypesInput {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => String, { nullable: true })
  department?: string

  @Field(() => String, { nullable: true })
  page?: number
}
