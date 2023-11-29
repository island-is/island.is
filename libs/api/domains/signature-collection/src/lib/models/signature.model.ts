import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Signee } from './signee.model'

@ObjectType()
export class Signature {
  @Field(() => ID)
  id!: string

  @Field()
  listId!: string

  @Field(() => Date)
  created!: Date

  @Field(() => Date)
  modified!: Date

  @Field(() => Signee)
  signee!: Signee

  @Field(() => Boolean, { nullable: true })
  active?: boolean

  @Field()
  signatureType!: string
}
