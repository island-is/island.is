import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SignatureCollectionNationalIdError {
  @Field()
  nationalId!: string

  @Field()
  message!: string
}
