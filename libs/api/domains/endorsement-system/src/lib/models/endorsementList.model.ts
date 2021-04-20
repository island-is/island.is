import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import {
  EndorsementListEndorsementMetaEnum,
  EndorsementListTagsEnum,
} from '../../../gen/fetch'
import { Endorsement } from './endorsement.model'
import { ValidationRule } from './validationRule.model'

registerEnumType(EndorsementListEndorsementMetaEnum, {
  name: 'EndorsementListEndorsementMetaEnum',
})

registerEnumType(EndorsementListTagsEnum, {
  name: 'EndorsementListTagsEnum',
})

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
  endorsements!: Endorsement[]

  @Field()
  created!: string

  @Field()
  modified!: string
}
