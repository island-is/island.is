import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RskCompanyFormOfOperation {
  @Field(() => String)
  type!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  suffix!: string
}
