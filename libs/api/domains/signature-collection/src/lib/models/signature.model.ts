import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SignatureCollectionSignee } from './signee.model'

@ObjectType()
export class SignatureCollectionSignature {
  @Field(() => ID)
  id!: string

  @Field()
  listId!: string

  @Field(() => Date)
  created!: Date

  @Field(() => Date)
  modified!: Date

  @Field(() => SignatureCollectionSignee)
  signee!: SignatureCollectionSignee

  @Field(() => Boolean, { nullable: true })
  active?: boolean

  @Field()
  signatureType!: string
}
