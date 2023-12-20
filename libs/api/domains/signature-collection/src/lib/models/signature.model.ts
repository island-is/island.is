import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SignatureCollectionSigneeBase } from './signee.model'

@ObjectType()
export class SignatureCollectionSignature {
  @Field(() => ID)
  id!: string

  @Field()
  listId!: string

  @Field(() => Date)
  created!: Date

  @Field(() => SignatureCollectionSigneeBase)
  signee!: SignatureCollectionSigneeBase

  @Field(() => Boolean, { nullable: true })
  active?: boolean

  @Field()
  signatureType!: string
}
