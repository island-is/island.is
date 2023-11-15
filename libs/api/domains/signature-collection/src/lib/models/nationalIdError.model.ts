import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalIdError {
  @Field()
  nationalId!: string

  @Field()
  message!: string
}
