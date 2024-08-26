import { Field, ObjectType, ID } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { EndorsementListTagsEnum } from '../enums/endorsementListTags.enum'
import { CacheField } from '@island.is/nest/graphql' // Importing CacheField

@ObjectType()
export class EndorsementList {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => String, { nullable: true })
  description!: string | null

  @Field(() => Date)
  closedDate!: Date

  @Field(() => Date)
  openedDate!: Date

  @Field()
  adminLock!: boolean

  @CacheField(() => [EndorsementListTagsEnum])  // Using CacheField for non-scalar array
  tags!: EndorsementListTagsEnum[]

  @CacheField(() => graphqlTypeJson)  // Using CacheField for non-scalar object
  meta!: object

  @Field()
  created!: string

  @Field()
  modified!: string

  @Field({ nullable: true })
  ownerName?: string

  @Field({ nullable: true })
  owner?: string

  @Field({ nullable: true })
  endorsementCounter?: number
}
