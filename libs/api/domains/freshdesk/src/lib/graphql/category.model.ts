import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CategoryResponse } from '@island.is/clients/freshdesk'

@ObjectType()
export class Category implements CategoryResponse {
  @Field(() => ID)
  id!: number

  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  description?: string
}
