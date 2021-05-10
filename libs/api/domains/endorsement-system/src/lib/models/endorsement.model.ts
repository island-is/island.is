import { Field, ObjectType, ID } from '@nestjs/graphql'
import { EndorsementMetadata } from './endorsementMetadata.model'

@ObjectType()
export class Endorsement {
  @Field(() => ID)
  id!: string

  @Field()
  endorser!: string

  @Field()
  endorsementListId!: string

  @Field(() => EndorsementMetadata)
  meta!: EndorsementMetadata

  @Field()
  created!: string

  @Field()
  modified!: string
}
