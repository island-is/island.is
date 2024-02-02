import { InputType, Field } from '@nestjs/graphql'

@InputType('MinistryOfJusticeAdvertsInput')
export class AdvertsInput {
  @Field(() => String, { nullable: true })
  search?: string
}
