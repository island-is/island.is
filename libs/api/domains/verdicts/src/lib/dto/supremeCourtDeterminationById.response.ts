import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import graphqlTypeJson from 'graphql-type-json'
import type { Document } from '@contentful/rich-text-types'

type Html = { __typename: string; document?: Document }

@ObjectType('WebSupremeCourtDeterminationByIdItem')
class Item {
  @Field(() => String)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  caseNumber!: string

  @Field(() => Date)
  date!: Date

  @CacheField(() => [String])
  keywords!: string[]

  @CacheField(() => graphqlTypeJson, { nullable: true })
  richText?: Html | null

  @Field(() => String)
  presentings!: string
}

@ObjectType('WebSupremeCourtDeterminationByIdResponse')
export class SupremeCourtDeterminationByIdResponse {
  @CacheField(() => Item)
  item!: Item
}
