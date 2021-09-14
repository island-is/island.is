import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class RskCompanyRelatedParty {
  @Field(() => String)
  type!: string

  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  name!: string
}
