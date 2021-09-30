import { Field, ObjectType, ID } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { EndorsementListTagsEnum } from '../enums/endorsementListTags.enum'
import { Endorsement } from './endorsement.model'
import { ValidationRule } from './validationRule.model'

@ObjectType()
export class EndorsementList {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  description!: string | null

  @Field({ nullable: true })
  closedDate!: string | null

  @Field({ nullable: true })
  openedDate?: string | null

  @Field(() => [EndorsementListTagsEnum])
  tags!: EndorsementListTagsEnum[]

  @Field(() => [ValidationRule])
  validationRules!: ValidationRule[]

  @Field()
  owner!: string

  @Field(() => [Endorsement])
  endorsements?: Endorsement[]

  @Field(() => graphqlTypeJson)
  meta!: object

  @Field()
  created!: string

  @Field()
  modified!: string
}
