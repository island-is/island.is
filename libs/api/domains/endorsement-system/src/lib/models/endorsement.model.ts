import { Field, ObjectType, ID } from '@nestjs/graphql'
import { EndorsementListOpen } from './endorsementListOpen.model'
import { EndorsementMetadata } from './endorsementMetadata.model'
import { CacheField } from '@island.is/nest/graphql' // Importing CacheField

@ObjectType()
export class Endorsement {
  @Field(() => ID)
  id!: string

  @Field()
  endorser!: string

  @Field()
  endorsementListId!: string

  @CacheField(() => EndorsementListOpen, { nullable: true })
  endorsementList?: EndorsementListOpen

  @CacheField(() => EndorsementMetadata)
  meta!: EndorsementMetadata

  @Field()
  created!: string

  @Field()
  modified!: string
}
