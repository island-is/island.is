import { Field, ObjectType, ID } from '@nestjs/graphql'
import { EndorsementListEndorsementMetaEnum } from '../enums/endorsementListEndorsementMeta.enum'
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

  @Field(() => [EndorsementListEndorsementMetaEnum])
  endorsementMeta!: EndorsementListEndorsementMetaEnum[]

  @Field(() => [EndorsementListTagsEnum])
  tags!: EndorsementListTagsEnum[]

  @Field(() => [ValidationRule])
  validationRules!: ValidationRule[]

  @Field()
  owner!: string

  @Field(() => [Endorsement])
  endorsements?: Endorsement[]

  @Field()
  created!: string

  @Field()
  modified!: string
}
