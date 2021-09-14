import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RskCompanyLink {
  @Field(() => String)
  rel!: string

  @Field(() => String)
  href!: string
}
