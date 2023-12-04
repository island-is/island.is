import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SignatureCollectionOwner } from './owner.model'
import { SignatureCollectionArea } from './area.model'

@ObjectType()
export class SignatureCollectionList {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => SignatureCollectionArea)
  area!: SignatureCollectionArea

  @Field(() => Date)
  endTime!: Date

  @Field(() => Date)
  startTime!: Date

  @Field(() => SignatureCollectionOwner)
  owner!: SignatureCollectionOwner

  @Field(() => [SignatureCollectionOwner], { nullable: true })
  collectors?: SignatureCollectionOwner[]

  @Field(() => Boolean, { nullable: true })
  active?: boolean

  @Field({ nullable: true })
  collectionId?: string

  @Field({ nullable: true })
  link?: string

  @Field({ nullable: true })
  numberOfSignatures?: number
}
