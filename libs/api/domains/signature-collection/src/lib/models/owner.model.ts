import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SignatureCollectionOwner {
  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  phone?: string

  @Field({ nullable: true })
  email?: string
}
