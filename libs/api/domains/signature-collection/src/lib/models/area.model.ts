import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CollectionStatus } from './status.model'

@ObjectType()
export class SignatureCollectionAreaBase {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string
}

@ObjectType()
export class SignatureCollectionArea {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field()
  min!: number

  @Field(() => CollectionStatus, { nullable: true })
  collectionStatus?: CollectionStatus

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean

  @Field({ nullable: true })
  max!: number

  @Field({ nullable: true })
  collectionId?: string
}
