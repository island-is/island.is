import { Field, ObjectType, ID } from '@nestjs/graphql'
import { SearchResponse } from '@island.is/clients/freshdesk'

@ObjectType()
export class Search implements SearchResponse {
  @Field(() => ID)
  id!: number

  @Field(() => Number)
  type!: number

  @Field(() => Number)
  category_id!: number

  @Field(() => Number)
  folder_id!: number

  @Field(() => Number)
  folder_visibility!: number

  @Field(() => Number)
  agent_id!: number

  @Field(() => String)
  path!: string

  @Field(() => Number)
  language_id!: number

  @Field(() => String)
  title!: string

  @Field(() => Number)
  status!: number

  @Field(() => String)
  description!: string

  @Field(() => String)
  description_text!: string

  @Field(() => String)
  category_name!: string

  @Field(() => String)
  folder_name!: string
}
