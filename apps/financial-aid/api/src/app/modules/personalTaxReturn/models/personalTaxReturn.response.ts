import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PersonalTaxReturnResponse {
  @Field(() => String)
  url!: string
}
